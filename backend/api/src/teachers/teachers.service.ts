import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryTeachersDto } from './dto/query-teachers.dto';
import { UpdateTeacherProfileDto } from './dto/update-teacher-profile.dto';
import { AddSubjectDto } from './dto/add-subject.dto';
import { AddAvailabilityDto } from './dto/add-availability.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class TeachersService {
    constructor(private prisma: PrismaService) { }

    async findAll(query: QueryTeachersDto) {
        const { subjectId, city, mode, priceMin, priceMax, page = 1, limit = 10 } = query;
        const skip = (page - 1) * limit;

        const where: any = {
            user: {
                isActive: true,
                role: UserRole.TEACHER,
            },
        };

        if (city) {
            where.city = { contains: city, mode: 'insensitive' };
        }

        if (priceMin !== undefined || priceMax !== undefined) {
            where.hourlyRate = {};
            if (priceMin !== undefined) where.hourlyRate.gte = priceMin;
            if (priceMax !== undefined) where.hourlyRate.lte = priceMax;
        }

        if (subjectId) {
            where.subjects = {
                some: {
                    subjectId: subjectId,
                },
            };
        }

        const [teachers, total] = await Promise.all([
            this.prisma.teacherProfile.findMany({
                where,
                skip,
                take: limit,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            avatar: true,
                        },
                    },
                    subjects: {
                        include: {
                            subject: true,
                        },
                    },
                },
                orderBy: {
                    rating: 'desc',
                },
            }),
            this.prisma.teacherProfile.count({ where }),
        ]);

        return {
            data: teachers,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        const teacher = await this.prisma.teacherProfile.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        avatar: true,
                    },
                },
                subjects: {
                    include: {
                        subject: true,
                    },
                },
                availabilitySlots: {
                    where: { isActive: true },
                    orderBy: [
                        { dayOfWeek: 'asc' },
                        { startTime: 'asc' },
                    ],
                },
                classes: {
                    where: { isActive: true },
                    take: 5,
                },
            },
        });

        if (!teacher) {
            throw new NotFoundException('Teacher not found');
        }

        return teacher;
    }

    async getMyProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { teacherProfile: true },
        });

        if (!user || user.role !== UserRole.TEACHER) {
            throw new ForbiddenException('Only teachers can access this resource');
        }

        if (!user.teacherProfile) {
            throw new NotFoundException('Teacher profile not found');
        }

        return this.findOne(user.teacherProfile.id);
    }

    async updateProfile(userId: string, dto: UpdateTeacherProfileDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { teacherProfile: true },
        });

        if (!user || user.role !== UserRole.TEACHER) {
            throw new ForbiddenException('Only teachers can access this resource');
        }

        if (!user.teacherProfile) {
            throw new NotFoundException('Teacher profile not found');
        }

        const updatedProfile = await this.prisma.teacherProfile.update({
            where: { id: user.teacherProfile.id },
            data: dto,
            include: {
                user: true,
                subjects: {
                    include: {
                        subject: true,
                    },
                },
                availabilitySlots: true,
            },
        });

        return updatedProfile;
    }

    async addSubject(userId: string, dto: AddSubjectDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { teacherProfile: true },
        });

        if (!user || user.role !== UserRole.TEACHER) {
            throw new ForbiddenException('Only teachers can access this resource');
        }

        if (!user.teacherProfile) {
            throw new NotFoundException('Teacher profile not found');
        }

        // Check if subject exists
        const subject = await this.prisma.subject.findUnique({
            where: { id: dto.subjectId },
        });

        if (!subject) {
            throw new NotFoundException('Subject not found');
        }

        // Check if already added
        const existing = await this.prisma.teacherSubject.findUnique({
            where: {
                teacherProfileId_subjectId: {
                    teacherProfileId: user.teacherProfile.id,
                    subjectId: dto.subjectId,
                },
            },
        });

        if (existing) {
            throw new BadRequestException('Subject already added');
        }

        const teacherSubject = await this.prisma.teacherSubject.create({
            data: {
                teacherProfileId: user.teacherProfile.id,
                subjectId: dto.subjectId,
                isPrimary: dto.isPrimary || false,
            },
            include: {
                subject: true,
            },
        });

        return teacherSubject;
    }

    async removeSubject(userId: string, teacherSubjectId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { teacherProfile: true },
        });

        if (!user || user.role !== UserRole.TEACHER) {
            throw new ForbiddenException('Only teachers can access this resource');
        }

        // Verify ownership
        const teacherSubject = await this.prisma.teacherSubject.findUnique({
            where: { id: teacherSubjectId },
        });

        if (!teacherSubject || teacherSubject.teacherProfileId !== user.teacherProfile.id) {
            throw new NotFoundException('Teacher subject not found');
        }

        await this.prisma.teacherSubject.delete({
            where: { id: teacherSubjectId },
        });

        return { message: 'Subject removed successfully' };
    }

    async addAvailability(userId: string, dto: AddAvailabilityDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { teacherProfile: true },
        });

        if (!user || user.role !== UserRole.TEACHER) {
            throw new ForbiddenException('Only teachers can access this resource');
        }

        if (!user.teacherProfile) {
            throw new NotFoundException('Teacher profile not found');
        }

        const availability = await this.prisma.availabilitySlot.create({
            data: {
                teacherProfileId: user.teacherProfile.id,
                dayOfWeek: dto.dayOfWeek,
                startTime: dto.startTime,
                endTime: dto.endTime,
                isActive: dto.isActive ?? true,
            },
        });

        return availability;
    }

    async getAvailability(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { teacherProfile: true },
        });

        if (!user || user.role !== UserRole.TEACHER) {
            throw new ForbiddenException('Only teachers can access this resource');
        }

        if (!user.teacherProfile) {
            throw new NotFoundException('Teacher profile not found');
        }

        const slots = await this.prisma.availabilitySlot.findMany({
            where: {
                teacherProfileId: user.teacherProfile.id,
            },
            orderBy: [
                { dayOfWeek: 'asc' },
                { startTime: 'asc' },
            ],
        });

        return slots;
    }
}
