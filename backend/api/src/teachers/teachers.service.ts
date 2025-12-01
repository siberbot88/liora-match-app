import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryTeachersDto } from './dto/query-teachers.dto';
import { UpdateTeacherProfileDto } from './dto/update-teacher-profile.dto';
import { AddSubjectDto } from './dto/add-subject.dto';
import { AddAvailabilityDto } from './dto/add-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { BulkAddAvailabilityDto } from './dto/bulk-add-availability.dto';
import { UserRole, BookingStatus } from '@prisma/client';

@Injectable()
export class TeachersService {
    constructor(private prisma: PrismaService) { }

    // =============== PUBLIC METHODS ===============

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

    // =============== PROFILE MANAGEMENT ===============

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

    async getDashboardStats(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { teacherProfile: true },
        });

        if (!user || user.role !== UserRole.TEACHER || !user.teacherProfile) {
            throw new ForbiddenException('Only teachers can access this resource');
        }

        const teacherProfileId = user.teacherProfile.id;

        // Get counts
        const [
            activeClasses,
            totalStudents,
            pendingBookings,
            completedBookings,
            upcomingSessions,
        ] = await Promise.all([
            this.prisma.class.count({
                where: {
                    teacherProfileId,
                    isActive: true,
                },
            }),
            this.prisma.classEnrollment.count({
                where: {
                    class: {
                        teacherProfileId,
                        isActive: true,
                    },
                    isActive: true,
                },
            }),
            this.prisma.booking.count({
                where: {
                    teacherProfileId,
                    status: BookingStatus.PENDING,
                },
            }),
            this.prisma.booking.count({
                where: {
                    teacherProfileId,
                    status: BookingStatus.COMPLETED,
                },
            }),
            this.prisma.booking.count({
                where: {
                    teacherProfileId,
                    status: BookingStatus.CONFIRMED,
                    scheduledAt: {
                        gte: new Date(),
                    },
                },
            }),
        ]);

        // Calculate total earnings (from completed bookings)
        const earnings = await this.prisma.booking.aggregate({
            where: {
                teacherProfileId,
                status: BookingStatus.COMPLETED,
            },
            _sum: {
                totalPrice: true,
            },
        });

        return {
            activeClasses,
            totalStudents,
            pendingBookings,
            completedBookings,
            upcomingSessions,
            totalEarnings: earnings._sum.totalPrice || 0,
            rating: user.teacherProfile.rating || 0,
            totalReviews: user.teacherProfile.totalReviews || 0,
            isVerified: user.teacherProfile.isVerified,
        };
    }

    // =============== SUBJECT MANAGEMENT ===============

    async getAvailableSubjects() {
        const subjects = await this.prisma.subject.findMany({
            orderBy: {
                name: 'asc',
            },
        });

        return subjects;
    }

    async getMySubjects(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { teacherProfile: true },
        });

        if (!user || user.role !== UserRole.TEACHER || !user.teacherProfile) {
            throw new ForbiddenException('Only teachers can access this resource');
        }

        const teacherSubjects = await this.prisma.teacherSubject.findMany({
            where: {
                teacherProfileId: user.teacherProfile.id,
            },
            include: {
                subject: true,
            },
            orderBy: {
                isPrimary: 'desc',
            },
        });

        // Get stats for each subject
        const subjectsWithStats = await Promise.all(
            teacherSubjects.map(async (ts) => {
                const classCount = await this.prisma.class.count({
                    where: {
                        teacherProfileId: user.teacherProfile.id,
                        subjectId: ts.subjectId,
                        isActive: true,
                    },
                });

                const studentCount = await this.prisma.classEnrollment.count({
                    where: {
                        class: {
                            teacherProfileId: user.teacherProfile.id,
                            subjectId: ts.subjectId,
                            isActive: true,
                        },
                        isActive: true,
                    },
                });

                return {
                    ...ts,
                    stats: {
                        totalClasses: classCount,
                        totalStudents: studentCount,
                    },
                };
            })
        );

        return subjectsWithStats;
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

    // =============== AVAILABILITY MANAGEMENT ===============

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

    async bulkAddAvailability(userId: string, dto: BulkAddAvailabilityDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { teacherProfile: true },
        });

        if (!user || user.role !== UserRole.TEACHER || !user.teacherProfile) {
            throw new ForbiddenException('Only teachers can access this resource');
        }

        const slots = await Promise.all(
            dto.slots.map((slot) =>
                this.prisma.availabilitySlot.create({
                    data: {
                        teacherProfileId: user.teacherProfile.id,
                        dayOfWeek: slot.dayOfWeek,
                        startTime: slot.startTime,
                        endTime: slot.endTime,
                        isActive: slot.isActive ?? true,
                    },
                })
            )
        );

        return {
            message: `${slots.length} availability slots added successfully`,
            slots,
        };
    }

    async updateAvailability(userId: string, slotId: string, dto: UpdateAvailabilityDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { teacherProfile: true },
        });

        if (!user || user.role !== UserRole.TEACHER || !user.teacherProfile) {
            throw new ForbiddenException('Only teachers can access this resource');
        }

        // Verify ownership
        const slot = await this.prisma.availabilitySlot.findUnique({
            where: { id: slotId },
        });

        if (!slot || slot.teacherProfileId !== user.teacherProfile.id) {
            throw new NotFoundException('Availability slot not found');
        }

        const updated = await this.prisma.availabilitySlot.update({
            where: { id: slotId },
            data: dto,
        });

        return updated;
    }

    async deleteAvailability(userId: string, slotId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { teacherProfile: true },
        });

        if (!user || user.role !== UserRole.TEACHER || !user.teacherProfile) {
            throw new ForbiddenException('Only teachers can access this resource');
        }

        // Verify ownership
        const slot = await this.prisma.availabilitySlot.findUnique({
            where: { id: slotId },
        });

        if (!slot || slot.teacherProfileId !== user.teacherProfile.id) {
            throw new NotFoundException('Availability slot not found');
        }

        await this.prisma.availabilitySlot.delete({
            where: { id: slotId },
        });

        return { message: 'Availability slot deleted successfully' };
    }

    async getCalendar(userId: string, month?: number, year?: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { teacherProfile: true },
        });

        if (!user || user.role !== UserRole.TEACHER || !user.teacherProfile) {
            throw new ForbiddenException('Only teachers can access this resource');
        }

        const now = new Date();
        const targetMonth = month || now.getMonth() + 1;
        const targetYear = year || now.getFullYear();

        // Get first and last day of month
        const firstDay = new Date(targetYear, targetMonth - 1, 1);
        const lastDay = new Date(targetYear, targetMonth, 0, 23, 59, 59);

        // Get all confirmed bookings and sessions for the month
        const [bookings, sessions] = await Promise.all([
            this.prisma.booking.findMany({
                where: {
                    teacherProfileId: user.teacherProfile.id,
                    status: { in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED] },
                    scheduledAt: {
                        gte: firstDay,
                        lte: lastDay,
                    },
                },
                include: {
                    student: {
                        include: {
                            user: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                    subject: true,
                },
                orderBy: {
                    scheduledAt: 'asc',
                },
            }),
            this.prisma.classSession.findMany({
                where: {
                    teacherProfileId: user.teacherProfile.id,
                    scheduledAt: {
                        gte: firstDay,
                        lte: lastDay,
                    },
                },
                include: {
                    class: {
                        include: {
                            subject: true,
                        },
                    },
                },
                orderBy: {
                    scheduledAt: 'asc',
                },
            }),
        ]);

        return {
            month: targetMonth,
            year: targetYear,
            bookings,
            sessions,
        };
    }

    // =============== CLASS MANAGEMENT ===============

    async getMyClasses(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { teacherProfile: true },
        });

        if (!user || user.role !== UserRole.TEACHER || !user.teacherProfile) {
            throw new ForbiddenException('Only teachers can access this resource');
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

    async getClassStudents(userId: string, classId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { teacherProfile: true },
        });

        if (!user || user.role !== UserRole.TEACHER || !user.teacherProfile) {
            throw new ForbiddenException('Only teachers can access this resource');
        }

        // Verify class ownership
        const classItem = await this.prisma.class.findUnique({
            where: { id: classId },
        });

        if (!classItem || classItem.teacherProfileId !== user.teacherProfile.id) {
            throw new ForbiddenException('You do not have access to this class');
        }

        const enrollments = await this.prisma.classEnrollment.findMany({
            where: {
                classId,
                isActive: true,
            },
            include: {
                student: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatar: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                enrolledAt: 'desc',
            },
        });

        return enrollments;
    }

    async removeStudentFromClass(userId: string, classId: string, studentProfileId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { teacherProfile: true },
        });

        if (!user || user.role !== UserRole.TEACHER || !user.teacherProfile) {
            throw new ForbiddenException('Only teachers can access this resource');
        }

        // Verify class ownership
        const classItem = await this.prisma.class.findUnique({
            where: { id: classId },
        });

        if (!classItem || classItem.teacherProfileId !== user.teacherProfile.id) {
            throw new ForbiddenException('You do not have access to this class');
        }

        // Find and delete enrollment
        const enrollment = await this.prisma.classEnrollment.findUnique({
            where: {
                classId_studentProfileId: {
                    classId,
                    studentProfileId,
                },
            },
        });

        if (!enrollment) {
            throw new NotFoundException('Enrollment not found');
        }

        await this.prisma.classEnrollment.delete({
            where: {
                classId_studentProfileId: {
                    classId,
                    studentProfileId,
                },
            },
        });

        return { message: 'Student removed from class successfully' };
    }

    // =============== BOOKING MANAGEMENT ===============

    async getMyBookings(userId: string, status?: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { teacherProfile: true },
        });

        if (!user || user.role !== UserRole.TEACHER || !user.teacherProfile) {
            throw new ForbiddenException('Only teachers can access this resource');
        }

        const where: any = {
            teacherProfileId: user.teacherProfile.id,
        };

        if (status) {
            where.status = status.toUpperCase();
        }

        const bookings = await this.prisma.booking.findMany({
            where,
            include: {
                student: {
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
                class: {
                    select: {
                        title: true,
                    },
                },
            },
            orderBy: {
                scheduledAt: 'desc',
            },
        });

        return bookings;
    }

    async getPendingBookings(userId: string) {
        return this.getMyBookings(userId, 'PENDING');
    }

    // =============== REVIEWS & RATINGS ===============

    async getMyReviews(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { teacherProfile: true },
        });

        if (!user || user.role !== UserRole.TEACHER || !user.teacherProfile) {
            throw new ForbiddenException('Only teachers can access this resource');
        }

        // Note: Reviews model belum ada di schema, return placeholder
        // Akan diimplement saat Phase 2
        return {
            message: 'Reviews feature will be implemented in Phase 2',
            total: user.teacherProfile.totalReviews || 0,
            averageRating: user.teacherProfile.rating || 0,
            reviews: [],
        };
    }

    async getRatingStats(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { teacherProfile: true },
        });

        if (!user || user.role !== UserRole.TEACHER || !user.teacherProfile) {
            throw new ForbiddenException('Only teachers can access this resource');
        }

        return {
            averageRating: user.teacherProfile.rating || 0,
            totalReviews: user.teacherProfile.totalReviews || 0,
            // Breakdown will be available when Review model is implemented
            ratingBreakdown: {
                5: 0,
                4: 0,
                3: 0,
                2: 0,
                1: 0,
            },
        };
    }

    // =============== EARNINGS & REPORTS ===============

    async getEarningsSummary(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { teacherProfile: true },
        });

        if (!user || user.role !== UserRole.TEACHER || !user.teacherProfile) {
            throw new ForbiddenException('Only teachers can access this resource');
        }

        const completedBookings = await this.prisma.booking.aggregate({
            where: {
                teacherProfileId: user.teacherProfile.id,
                status: BookingStatus.COMPLETED,
            },
            _sum: {
                totalPrice: true,
            },
            _count: true,
        });

        const pendingPayments = await this.prisma.booking.aggregate({
            where: {
                teacherProfileId: user.teacherProfile.id,
                status: BookingStatus.CONFIRMED,
            },
            _sum: {
                totalPrice: true,
            },
        });

        return {
            totalEarnings: completedBookings._sum.totalPrice || 0,
            completedSessions: completedBookings._count || 0,
            pendingPayments: pendingPayments._sum.totalPrice || 0,
            averagePerSession: completedBookings._count > 0
                ? Math.round((completedBookings._sum.totalPrice || 0) / completedBookings._count)
                : 0,
        };
    }

    async getMonthlyEarnings(userId: string, month?: number, year?: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { teacherProfile: true },
        });

        if (!user || user.role !== UserRole.TEACHER || !user.teacherProfile) {
            throw new ForbiddenException('Only teachers can access this resource');
        }

        const now = new Date();
        const targetMonth = month || now.getMonth() + 1;
        const targetYear = year || now.getFullYear();

        const firstDay = new Date(targetYear, targetMonth - 1, 1);
        const lastDay = new Date(targetYear, targetMonth, 0, 23, 59, 59);

        const bookings = await this.prisma.booking.findMany({
            where: {
                teacherProfileId: user.teacherProfile.id,
                status: BookingStatus.COMPLETED,
                scheduledAt: {
                    gte: firstDay,
                    lte: lastDay,
                },
            },
            include: {
                subject: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                scheduledAt: 'asc',
            },
        });

        const totalEarnings = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);

        return {
            month: targetMonth,
            year: targetYear,
            totalEarnings,
            totalSessions: bookings.length,
            averagePerSession: bookings.length > 0 ? Math.round(totalEarnings / bookings.length) : 0,
            bookings,
        };
    }
}
