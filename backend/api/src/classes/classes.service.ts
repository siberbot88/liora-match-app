import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryClassesDto } from './dto/query-classes.dto';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class ClassesService {
    constructor(private prisma: PrismaService) { }

    async findAll(query: QueryClassesDto) {
        const { subjectId, mode, search, page = 1, limit = 10 } = query;
        const skip = (page - 1) * limit;

        const where: any = {
            isActive: true,
        };

        if (subjectId) {
            where.subjectId = subjectId;
        }

        if (mode) {
            where.mode = mode;
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [classes, total] = await Promise.all([
            this.prisma.class.findMany({
                where,
                skip,
                take: limit,
                include: {
                    subject: true,
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
                    _count: {
                        select: {
                            enrollments: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.class.count({ where }),
        ]);

        return {
            data: classes,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        const classItem = await this.prisma.class.findUnique({
            where: { id },
            include: {
                subject: true,
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
                enrollments: {
                    include: {
                        student: {
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
                    },
                },
                sessions: {
                    orderBy: {
                        scheduledAt: 'desc',
                    },
                    take: 5,
                },
            },
        });

        if (!classItem) {
            throw new NotFoundException('Class not found');
        }

        return classItem;
    }

    async create(userId: string, dto: CreateClassDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { teacherProfile: true },
        });

        if (!user || user.role !== UserRole.TEACHER) {
            throw new ForbiddenException('Only teachers can create classes');
        }

        if (!user.teacherProfile) {
            throw new NotFoundException('Teacher profile not found');
        }

        // Verify subject exists
        const subject = await this.prisma.subject.findUnique({
            where: { id: dto.subjectId },
        });

        if (!subject) {
            throw new NotFoundException('Subject not found');
        }

        const newClass = await this.prisma.class.create({
            data: {
                title: dto.title,
                description: dto.description,
                subjectId: dto.subjectId,
                teacherProfileId: user.teacherProfile.id,
                mode: dto.mode,
                location: dto.location,
                maxStudents: dto.maxStudents,
                pricePerSession: 50000,
                duration: 60,
            },
            include: {
                subject: true,
                teacher: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        return newClass;
    }

    async update(userId: string, classId: string, dto: UpdateClassDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { teacherProfile: true },
        });

        if (!user || user.role !== UserRole.TEACHER) {
            throw new ForbiddenException('Only teachers can update classes');
        }

        const classItem = await this.prisma.class.findUnique({
            where: { id: classId },
        });

        if (!classItem) {
            throw new NotFoundException('Class not found');
        }

        if (classItem.teacherProfileId !== user.teacherProfile.id) {
            throw new ForbiddenException('You can only update your own classes');
        }

        const updatedClass = await this.prisma.class.update({
            where: { id: classId },
            data: dto,
            include: {
                subject: true,
                teacher: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        return updatedClass;
    }

    async remove(userId: string, classId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { teacherProfile: true },
        });

        if (!user || user.role !== UserRole.TEACHER) {
            throw new ForbiddenException('Only teachers can delete classes');
        }

        const classItem = await this.prisma.class.findUnique({
            where: { id: classId },
        });

        if (!classItem) {
            throw new NotFoundException('Class not found');
        }

        if (classItem.teacherProfileId !== user.teacherProfile.id) {
            throw new ForbiddenException('You can only delete your own classes');
        }

        await this.prisma.class.update({
            where: { id: classId },
            data: { isActive: false },
        });

        return { message: 'Class deleted successfully' };
    }

    async enroll(userId: string, classId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { studentProfile: true },
        });

        if (!user || user.role !== UserRole.STUDENT) {
            throw new ForbiddenException('Only students can enroll in classes');
        }

        if (!user.studentProfile) {
            throw new NotFoundException('Student profile not found');
        }

        const classItem = await this.prisma.class.findUnique({
            where: { id: classId },
            include: {
                _count: {
                    select: {
                        enrollments: true,
                    },
                },
            },
        });

        if (!classItem) {
            throw new NotFoundException('Class not found');
        }

        if (!classItem.isActive) {
            throw new BadRequestException('This class is not active');
        }

        if (classItem._count.enrollments >= classItem.maxStudents) {
            throw new BadRequestException('Class is full');
        }

        const existingEnrollment = await this.prisma.classEnrollment.findUnique({
            where: {
                classId_studentProfileId: {
                    classId: classId,
                    studentProfileId: user.studentProfile.id,
                },
            },
        });

        if (existingEnrollment) {
            throw new BadRequestException('Already enrolled in this class');
        }

        const enrollment = await this.prisma.classEnrollment.create({
            data: {
                studentProfileId: user.studentProfile.id,
                classId: classId,
            },
            include: {
                class: {
                    include: {
                        subject: true,
                        teacher: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
            },
        });

        return enrollment;
    }

    async unenroll(userId: string, classId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { studentProfile: true },
        });

        if (!user || user.role !== UserRole.STUDENT || !user.studentProfile) {
            throw new ForbiddenException('Only students can unenroll from classes');
        }

        const enrollment = await this.prisma.classEnrollment.findUnique({
            where: {
                classId_studentProfileId: {
                    classId,
                    studentProfileId: user.studentProfile.id,
                },
            },
        });

        if (!enrollment) {
            throw new NotFoundException('Not enrolled in this class');
        }

        await this.prisma.classEnrollment.delete({
            where: {
                classId_studentProfileId: {
                    classId,
                    studentProfileId: user.studentProfile.id,
                },
            },
        });

        return { message: 'Successfully unenrolled from class' };
    }

    async getTeacherClasses(userId: string) {
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

        const classes = await this.prisma.class.findMany({
            where: {
                teacherProfileId: user.teacherProfile.id,
            },
            include: {
                subject: true,
                _count: {
                    select: {
                        enrollments: true,
                        sessions: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return classes;
    }

    // =============== SESSION MANAGEMENT ===============

    async createSession(userId: string, classId: string, dto: CreateSessionDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { teacherProfile: true },
        });

        if (!user || user.role !== UserRole.TEACHER || !user.teacherProfile) {
            throw new ForbiddenException('Only teachers can create sessions');
        }

        const classItem = await this.prisma.class.findUnique({
            where: { id: classId },
        });

        if (!classItem) {
            throw new NotFoundException('Class not found');
        }

        if (classItem.teacherProfileId !== user.teacherProfile.id) {
            throw new ForbiddenException('You can only create sessions for your own classes');
        }

        const session = await this.prisma.classSession.create({
            data: {
                classId,
                teacherProfileId: user.teacherProfile.id,
                title: dto.title,
                description: dto.description,
                scheduledAt: new Date(dto.scheduledAt),
                duration: dto.duration,
                meetingUrl: dto.meetingUrl,
                notes: dto.notes,
                status: 'SCHEDULED',
            },
            include: {
                class: {
                    include: {
                        subject: true,
                    },
                },
            },
        });

        return session;
    }

    async getSessions(classId: string) {
        const sessions = await this.prisma.classSession.findMany({
            where: { classId },
            orderBy: {
                scheduledAt: 'asc',
            },
            include: {
                class: {
                    select: {
                        title: true,
                        subject: true,
                    },
                },
            },
        });

        return sessions;
    }

    async getSessionDetail(sessionId: string) {
        const session = await this.prisma.classSession.findUnique({
            where: { id: sessionId },
            include: {
                class: {
                    include: {
                        subject: true,
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
                    },
                },
            },
        });

        if (!session) {
            throw new NotFoundException('Session not found');
        }

        return session;
    }

    async updateSession(userId: string, sessionId: string, dto: Partial<CreateSessionDto>) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { teacherProfile: true },
        });

        if (!user || user.role !== UserRole.TEACHER || !user.teacherProfile) {
            throw new ForbiddenException('Only teachers can update sessions');
        }

        const session = await this.prisma.classSession.findUnique({
            where: { id: sessionId },
        });

        if (!session) {
            throw new NotFoundException('Session not found');
        }

        if (session.teacherProfileId !== user.teacherProfile.id) {
            throw new ForbiddenException('You can only update your own sessions');
        }

        const updated = await this.prisma.classSession.update({
            where: { id: sessionId },
            data: {
                ...dto,
                scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
            },
        });

        return updated;
    }

    async deleteSession(userId: string, sessionId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { teacherProfile: true },
        });

        if (!user || user.role !== UserRole.TEACHER || !user.teacherProfile) {
            throw new ForbiddenException('Only teachers can delete sessions');
        }

        const session = await this.prisma.classSession.findUnique({
            where: { id: sessionId },
        });

        if (!session) {
            throw new NotFoundException('Session not found');
        }

        if (session.teacherProfileId !== user.teacherProfile.id) {
            throw new ForbiddenException('You can only delete your own sessions');
        }

        await this.prisma.classSession.delete({
            where: { id: sessionId },
        });

        return { message: 'Session deleted successfully' };
    }
}
