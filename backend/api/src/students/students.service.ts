import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateStudentPreferencesDto } from './dto/update-student-preferences.dto';
import { SearchTeachersDto } from './dto/search-teachers.dto';
import { SearchClassesDto } from './dto/search-classes.dto';
import { StudentDashboardDto, StudentTier } from './dto/student-dashboard.dto';
import { UserRole, BookingStatus } from '@prisma/client';

@Injectable()
export class StudentsService {
    constructor(private prisma: PrismaService) { }

    // =============== PROFILE MANAGEMENT ===============

    async getMyProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                studentProfile: {
                    include: {
                        enrollments: {
                            include: {
                                class: {
                                    include: {
                                        // subject: true, // Subject is now a string field, not a relation
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
                            take: 5,
                            orderBy: { enrolledAt: 'desc' },
                        },
                        bookings: {
                            where: {
                                status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
                            },
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
                            take: 5,
                            orderBy: { scheduledAt: 'asc' },
                        },
                    },
                },
            },
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

    async updatePreferences(userId: string, dto: UpdateStudentPreferencesDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { studentProfile: true },
        });

        if (!user || user.role !== UserRole.STUDENT || !user.studentProfile) {
            throw new ForbiddenException('Only students can access this resource');
        }

        const updated = await this.prisma.studentProfile.update({
            where: { id: user.studentProfile.id },
            data: {
                grade: dto.grade,
                school: dto.school,
                address: dto.address,
                parentName: dto.parentName,
                parentPhone: dto.parentPhone,
                learningGoals: dto.learningGoals,
            },
        });

        return updated;
    }

    async getDashboard(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { studentProfile: true },
        });

        if (!user || user.role !== UserRole.STUDENT || !user.studentProfile) {
            throw new ForbiddenException('Only students can access this resource');
        }

        const [
            enrolledClasses,
            upcomingBookings,
            completedBookings,
            totalSpent,
        ] = await Promise.all([
            this.prisma.classEnrollment.count({
                where: {
                    studentProfileId: user.studentProfile.id,

                },
            }),
            this.prisma.booking.count({
                where: {
                    studentProfileId: user.studentProfile.id,
                    status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
                    scheduledAt: {
                        gte: new Date(),
                    },
                },
            }),
            this.prisma.booking.count({
                where: {
                    studentProfileId: user.studentProfile.id,
                    status: BookingStatus.COMPLETED,
                },
            }),
            this.prisma.booking.aggregate({
                where: {
                    studentProfileId: user.studentProfile.id,
                    status: BookingStatus.COMPLETED,
                },
                _sum: {
                    totalPrice: true,
                },
            }),
        ]);

        return {
            enrolledClasses,
            upcomingBookings,
            completedBookings,
            totalSpent: totalSpent._sum.totalPrice || 0,
        };
    }

    // =============== TEACHER DISCOVERY ===============

    async searchTeachers(query: SearchTeachersDto) {
        const {
            subjectId,
            city,
            province,
            priceMin,
            priceMax,
            minRating,
            mode,
            search,
            sortBy = 'rating',
            sortOrder = 'desc',
            verifiedOnly,
            page = 1,
            limit = 10,
        } = query;

        const skip = (page - 1) * limit;
        const where: any = {
            user: {

                role: UserRole.TEACHER,
            },
        };

        if (city) {
            where.city = { contains: city, mode: 'insensitive' };
        }

        if (province) {
            where.province = { contains: province, mode: 'insensitive' };
        }

        if (priceMin !== undefined || priceMax !== undefined) {
            where.hourlyRate = {};
            if (priceMin !== undefined) where.hourlyRate.gte = priceMin;
            if (priceMax !== undefined) where.hourlyRate.lte = priceMax;
        }

        if (minRating !== undefined) {
            where.rating = { gte: minRating };
        }

        if (verifiedOnly) {
            where.isVerified = true;
        }

        if (subjectId) {
            where.subjects = {
                some: {
                    subjectId: subjectId,
                },
            };
        }

        if (search) {
            where.OR = [
                { user: { name: { contains: search, mode: 'insensitive' } } },
                { bio: { contains: search, mode: 'insensitive' } },
                { education: { contains: search, mode: 'insensitive' } },
            ];
        }

        const orderBy: any = {};
        if (sortBy === 'rating') {
            orderBy.rating = sortOrder;
        } else if (sortBy === 'price') {
            orderBy.hourlyRate = sortOrder;
        } else if (sortBy === 'experience') {
            orderBy.experience = sortOrder;
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
                            avatar: true,
                        },
                    },
                    subjects: {
                        include: {
                            subject: true,
                        },
                    },
                },
                orderBy,
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

    async getTeacherDetail(teacherId: string) {
        const teacher = await this.prisma.teacherProfile.findUnique({
            where: { id: teacherId },
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
                    orderBy: [
                        { dayOfWeek: 'asc' },
                        { startTime: 'asc' },
                    ],
                },
                classes: {
                    include: {
                        // subject: true, // Subject is now a string field, not a relation
                        _count: {
                            select: {
                                enrollments: true,
                            },
                        },
                    },
                    take: 5,
                },
            },
        });

        if (!teacher) {
            throw new NotFoundException('Teacher not found');
        }

        // Get reviews (placeholder for now)
        const reviews = {
            total: teacher.totalReviews || 0,
            averageRating: teacher.rating || 0,
            reviews: [], // Will be implemented when Review model is added
        };

        return {
            ...teacher,
            reviews,
        };
    }

    async getRecommendedTeachers(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { studentProfile: true },
        });

        if (!user || user.role !== UserRole.STUDENT || !user.studentProfile) {
            throw new ForbiddenException('Only students can access this resource');
        }

        // Get top-rated verified teachers
        const teachers = await this.prisma.teacherProfile.findMany({
            where: {
                user: {

                    role: UserRole.TEACHER,
                },
                isVerified: true,
                rating: {
                    gte: 4.0,
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
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
            take: 10,
        });

        return teachers;
    }

    async addToFavorites(userId: string, teacherId: string) {
        // Note: FavoriteTeacher model belum ada di schema
        // Return placeholder
        return {
            message: 'Favorites feature will be implemented with FavoriteTeacher model',
            teacherId,
        };
    }

    async removeFromFavorites(userId: string, teacherId: string) {
        return {
            message: 'Favorites feature will be implemented with FavoriteTeacher model',
            teacherId,
        };
    }

    async getFavoriteTeachers(userId: string) {
        return {
            message: 'Favorites feature will be implemented with FavoriteTeacher model',
            favorites: [],
        };
    }

    // =============== CLASS DISCOVERY & ENROLLMENT ===============

    async searchClasses(query: SearchClassesDto) {
        const {
            subjectId,
            mode,
            priceMin,
            priceMax,
            search,
            availableOnly,
            sortBy = 'popularity',
            page = 1,
            limit = 10,
        } = query;

        const skip = (page - 1) * limit;
        const where: any = {

        };

        if (subjectId) {
            where.subjectId = subjectId;
        }

        if (mode) {
            where.mode = mode;
        }

        if (priceMin !== undefined || priceMax !== undefined) {
            where.pricePerSession = {};
            if (priceMin !== undefined) where.pricePerSession.gte = priceMin;
            if (priceMax !== undefined) where.pricePerSession.lte = priceMax;
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        const orderBy: any = {};
        if (sortBy === 'price') {
            orderBy.pricePerSession = 'asc';
        } else if (sortBy === 'popularity') {
            // Order by enrollment count (approximation)
            orderBy.createdAt = 'desc';
        } else if (sortBy === 'rating') {
            orderBy.teacher = { rating: 'desc' };
        }

        const [classes, total] = await Promise.all([
            this.prisma.class.findMany({
                where,
                skip,
                take: limit,
                include: {
                    // subject: true, // Subject is now a string field, not a relation
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
                orderBy,
            }),
            this.prisma.class.count({ where }),
        ]);

        // Filter by availability if requested
        let filteredClasses = classes;
        if (availableOnly) {
            // filteredClasses = classes.filter(
            //     (c) => c._count.enrollments < c.maxStudents // _count not available
            // );
        }

        return {
            data: filteredClasses,
            meta: {
                total: availableOnly ? filteredClasses.length : total,
                page,
                limit,
                totalPages: Math.ceil((availableOnly ? filteredClasses.length : total) / limit),
            },
        };
    }

    async getClassDetail(classId: string) {
        const classItem = await this.prisma.class.findUnique({
            where: { id: classId },
            include: {
                // subject: true, // Subject is now a string field, not a relation
                teacher: {
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
                _count: {
                    select: {
                        enrollments: true,
                        sessions: true,
                    },
                },
                sessions: {
                    where: {
                        scheduledAt: {
                            gte: new Date(),
                        },
                    },
                    orderBy: {
                        scheduledAt: 'asc',
                    },
                    take: 5,
                },
            },
        });

        if (!classItem) {
            throw new NotFoundException('Class not found');
        }

        return {
            ...classItem,
            // availableSlots: classItem.maxStudents - classItem._count.enrollments, // _count not available
        };
    }

    async getEnrolledClasses(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { studentProfile: true },
        });

        if (!user || user.role !== UserRole.STUDENT || !user.studentProfile) {
            throw new ForbiddenException('Only students can access this resource');
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
                        // subject: true, // Subject is now a string field, not a relation
                        _count: {
                            select: {
                                enrollments: true,
                                sessions: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                enrolledAt: 'desc',
            },
        });

        return enrollments.map((enrollment) => ({
            enrollmentId: enrollment.id,
            enrolledAt: enrollment.enrolledAt,
            progress: enrollment.progress,
            // class: enrollment.class, // Enrollment doesn't include class relation by default
        }));
    }

    async getClassProgress(userId: string, classId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { studentProfile: true },
        });

        if (!user || user.role !== UserRole.STUDENT || !user.studentProfile) {
            throw new ForbiddenException('Only students can access this resource');
        }

        const enrollment = await this.prisma.classEnrollment.findUnique({
            where: {
                classId_studentProfileId: {
                    classId,
                    studentProfileId: user.studentProfile.id,
                },
            },
            include: {
                class: {
                    include: {
                        // subject: true, // Subject is now a string field, not a relation
                        _count: {
                            select: {
                                sessions: true,
                            },
                        },
                    },
                },
            },
        });

        if (!enrollment) {
            throw new NotFoundException('You are not enrolled in this class');
        }

        // Get attended sessions count (placeholder - will use attendance model later)
        const attendedSessions = 0; // TODO: implement when Attendance model is added

        return {
            classId,
            className: enrollment.class.title,
            subject: enrollment.class.subject,
            enrolledAt: enrollment.enrolledAt,
            progress: enrollment.progress,
            totalSessions: enrollment.class._count.sessions,
            attendedSessions,
        };
    }

    // =============== BOOKING MANAGEMENT ===============

    async getMyBookings(userId: string, status?: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { studentProfile: true },
        });

        if (!user || user.role !== UserRole.STUDENT || !user.studentProfile) {
            throw new ForbiddenException('Only students can access this resource');
        }

        const where: any = {
            studentProfileId: user.studentProfile.id,
        };

        if (status) {
            where.status = status.toUpperCase();
        }

        const bookings = await this.prisma.booking.findMany({
            where,
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

    async getBookingHistory(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { studentProfile: true },
        });

        if (!user || user.role !== UserRole.STUDENT || !user.studentProfile) {
            throw new ForbiddenException('Only students can access this resource');
        }

        const bookings = await this.prisma.booking.findMany({
            where: {
                studentProfileId: user.studentProfile.id,
                status: { in: [BookingStatus.COMPLETED, BookingStatus.CANCELLED] },
            },
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
            orderBy: {
                scheduledAt: 'desc',
            },
        });

        return bookings;
    }

    async getBookingDetail(userId: string, bookingId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { studentProfile: true },
        });

        if (!user || user.role !== UserRole.STUDENT || !user.studentProfile) {
            throw new ForbiddenException('Only students can access this resource');
        }

        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
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
                class: true,
            },
        });

        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        if (booking.studentProfileId !== user.studentProfile.id) {
            throw new ForbiddenException('You can only view your own bookings');
        }

        return booking;
    }

    // =============== LEARNING PROGRESS ===============

    async getLearningProgress(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { studentProfile: true },
        });

        if (!user || user.role !== UserRole.STUDENT || !user.studentProfile) {
            throw new ForbiddenException('Only students can access this resource');
        }

        const [enrollments, completedBookings] = await Promise.all([
            this.prisma.classEnrollment.findMany({
                where: {
                    studentProfileId: user.studentProfile.id,

                },
                include: {
                    class: {
                        include: {
                            // subject: true, // Subject is now a string field, not a relation
                        },
                    },
                },
            }),
            this.prisma.booking.count({
                where: {
                    studentProfileId: user.studentProfile.id,
                    status: BookingStatus.COMPLETED,
                },
            }),
        ]);

        const totalProgress = enrollments.length > 0
            ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
            : 0;

        return {
            totalClasses: enrollments.length,
            totalSessions: completedBookings,
            overallProgress: totalProgress,
            classesProgress: enrollments.map((e) => ({
                classId: e.classId,
                // className: e.class.title,
                // subject: e.class.subject.name, // Subject is now a string, not a relation
                progress: e.progress,
            })),
        };
    }

    async getSubjectProgress(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { studentProfile: true },
        });

        if (!user || user.role !== UserRole.STUDENT || !user.studentProfile) {
            throw new ForbiddenException('Only students can access this resource');
        }

        const enrollments = await this.prisma.classEnrollment.findMany({
            where: {
                studentProfileId: user.studentProfile.id,

            },
            include: {
                class: {
                    include: {
                        // subject: true, // Subject is now a string field, not a relation
                    },
                },
            },
        });

        // Group by subject
        const subjectMap = new Map();
        // COMMENTED OUT - Schema change: subject is now a string, not a relation
        // enrollments.forEach((enrollment) => {
        //     const subjectId = enrollment.class.subject.id;
        //     if (!subjectMap.has(subjectId)) {
        //         subjectMap.set(subjectId, {
        //             subjectId,
        //             subjectName: enrollment.class.subject.name,
        //             classes: [],
        //             averageProgress: 0,
        //         });
        //     }
        //     subjectMap.get(subjectId).classes.push({
        //         classId: enrollment.classId,
        //         className: enrollment.class.title,
        //         progress: enrollment.progress,
        //     });
        // });

        // Calculate average progress per subject
        const subjectProgress = Array.from(subjectMap.values()).map((subject) => {
            const avgProgress = Math.round(
                subject.classes.reduce((sum, c) => sum + c.progress, 0) / subject.classes.length
            );
            return {
                ...subject,
                averageProgress: avgProgress,
            };
        });

        return subjectProgress;
    }

    // =============== STUDENT DASHBOARD (LEVEL & POINTS) ===============

    async getStudentDashboardData(userId: string): Promise<StudentDashboardDto> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                studentProfile: {
                    include: {
                        studentLevel: true,
                        learningPoints: true,
                    },
                },
            },
        });

        if (!user || user.role !== UserRole.STUDENT || !user.studentProfile) {
            throw new ForbiddenException('Only students can access this resource');
        }

        const studentProfile = user.studentProfile;

        // Get or create student level
        let studentLevel = studentProfile.studentLevel;
        if (!studentLevel) {
            // Create initial level for student
            studentLevel = await this.prisma.studentLevel.create({
                data: {
                    studentId: studentProfile.id,
                    level: 1,
                    tier: 'FREE',
                    pointsRequired: 1000,
                },
            });
        }

        // Calculate total points from LearningPoint records
        const totalPointsResult = await this.prisma.learningPoint.aggregate({
            where: {
                studentId: studentProfile.id,
            },
            _sum: {
                points: true,
            },
        });

        const totalPoints = totalPointsResult._sum.points || 0;

        // Calculate progress to next level
        const nextLevelPoints = studentLevel.pointsRequired || 1000;
        const currentLevelPoints = studentLevel.level > 1 ? (studentLevel.level - 1) * 500 : 0;
        const pointsInCurrentLevel = totalPoints - currentLevelPoints;
        const pointsNeeded = Math.max(0, nextLevelPoints - pointsInCurrentLevel);
        const progressPercentage = Math.min(100, (pointsInCurrentLevel / (nextLevelPoints - currentLevelPoints)) * 100);

        // Determine tier based on student profile or payment status
        const tier = studentLevel.tier as StudentTier;

        return {
            level: studentLevel.level,
            levelName: `Level ${studentLevel.level}`,
            tier,
            points: totalPoints,
            nextLevelPoints: pointsNeeded,
            progressPercentage: Math.round(progressPercentage),
        };
    }
}
