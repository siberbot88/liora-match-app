import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class StudentsService {
    constructor(private prisma: PrismaService) { }

    async getMyProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { studentProfile: true },
        });

        if (!user || user.role !== UserRole.STUDENT) {
            throw new ForbiddenException('Only students can access this resource');
        }

        if (!user.studentProfile) {
            throw new NotFoundException('Student profile not found');
        }

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            avatar: user.avatar,
            studentProfile: user.studentProfile,
        };
    }

    async getMyClasses(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { studentProfile: true },
        });

        if (!user || user.role !== UserRole.STUDENT) {
            throw new ForbiddenException('Only students can access this resource');
        }

        if (!user.studentProfile) {
            throw new NotFoundException('Student profile not found');
        }

        const enrollments = await this.prisma.classEnrollment.findMany({
            where: {
                studentProfileId: user.studentProfile.id,
            },
            include: {
                class: {
                    include: {
                        teacher: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        name: true,
                                        avatar: true,
                                    },
                                },
                            },
                        },
                        subject: true,
                    },
                },
            },
            orderBy: {
                enrolledAt: 'desc',
            },
        });

        return enrollments.map(enrollment => ({
            enrollmentId: enrollment.id,
            enrolledAt: enrollment.enrolledAt,
            class: enrollment.class,
        }));
    }

    async getMyBookings(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { studentProfile: true },
        });

        if (!user || user.role !== UserRole.STUDENT) {
            throw new ForbiddenException('Only students can access this resource');
        }

        if (!user.studentProfile) {
            throw new NotFoundException('Student profile not found');
        }

        const bookings = await this.prisma.booking.findMany({
            where: {
                studentProfileId: user.studentProfile.id,
            },
            include: {
                teacher: {
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
                    },
                },
                subject: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return bookings;
    }
}
