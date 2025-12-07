import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    BadRequestException
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryClassesDto } from './dto/query-classes.dto';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { PublishClassDto } from './dto/publish-class.dto';
import { TeachingType, PriceModel } from '@prisma/client';

@Injectable()
export class ClassesService {
    constructor(private prisma: PrismaService) { }

    /**
     * Find all classes with filtering, search, and pagination
     */
    async findAll(query: QueryClassesDto) {
        const {
            page = 1,
            limit = 10,
            search,
            jenjang,
            teachingType,
            teacherProfileId,
            subject,
            isPublished
        } = query;

        const skip = (page - 1) * limit;

        const where: any = {};

        // Filter by jenjang
        if (jenjang) {
            where.jenjang = jenjang;
        }

        // Filter by teaching type
        if (teachingType) {
            where.teachingType = teachingType;
        }

        // Filter by teacher
        if (teacherProfileId) {
            where.teacherProfileId = teacherProfileId;
        }

        // Filter by subject
        if (subject) {
            where.subject = { contains: subject, mode: 'insensitive' };
        }

        // Filter by published status
        if (isPublished !== undefined) {
            where.isPublished = isPublished;
        }

        // Search in title and descriptions
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { descriptionShort: { contains: search, mode: 'insensitive' } },
                { descriptionLong: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [classes, total] = await Promise.all([
            this.prisma.class.findMany({
                where,
                skip,
                take: limit,
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
                    _count: {
                        select: {
                            enrollments: true,
                            feedback: true,
                            sections: true,
                            resources: true,
                        },
                    },
                },
                orderBy: {
                    lastUpdatedAt: 'desc',
                },
            }),
            this.prisma.class.count({ where }),
        ]);

        // Calculate statistics for each class
        const classesWithStats = await Promise.all(
            classes.map(async (classItem) => {
                const stats = await this.calculateStatistics(classItem.id);
                return {
                    ...classItem,
                    statistics: stats,
                };
            }),
        );

        return {
            data: classesWithStats,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Find one class by ID with full details
     */
    async findOne(id: string) {
        const classItem = await this.prisma.class.findUnique({
            where: { id },
            include: {
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
                sections: {
                    orderBy: { order: 'asc' },
                    include: {
                        lessons: {
                            orderBy: { order: 'asc' },
                        },
                    },
                },
                resources: {
                    orderBy: { order: 'asc' },
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
                feedback: {
                    include: {
                        student: {
                            include: {
                                user: {
                                    select: {
                                        name: true,
                                        avatar: true,
                                    },
                                },
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 10,
                },
            },
        });

        if (!classItem) {
            throw new NotFoundException('Class not found');
        }

        // Calculate statistics
        const statistics = await this.calculateStatistics(id);

        return {
            ...classItem,
            statistics,
        };
    }

    /**
     * Create a new class
     */
    async create(dto: CreateClassDto) {
        // Validate teacher exists
        const teacher = await this.prisma.teacherProfile.findUnique({
            where: { id: dto.teacherProfileId },
        });

        if (!teacher) {
            throw new NotFoundException('Teacher profile not found');
        }

        // Auto-determine priceModel based on teachingType if not provided
        const teachingType = dto.teachingType || TeachingType.ONLINE_COURSE;
        const priceModel = dto.priceModel || (
            teachingType === TeachingType.ONLINE_COURSE
                ? PriceModel.LIFETIME_ACCESS
                : PriceModel.PER_SESSION
        );

        // Validate price for PER_SESSION model
        if (priceModel === PriceModel.PER_SESSION && (!dto.price || dto.price <= 0)) {
            throw new BadRequestException('Price must be greater than 0 for per-session pricing');
        }

        // Create the class
        const newClass = await this.prisma.class.create({
            data: {
                teacherProfileId: dto.teacherProfileId,
                title: dto.title,
                subtitle: dto.subtitle,
                descriptionShort: dto.descriptionShort,
                descriptionLong: dto.descriptionLong,
                subject: dto.subject,
                jenjang: dto.jenjang,
                levelRange: dto.levelRange,
                teachingType,
                mainLanguage: dto.mainLanguage || 'Indonesian',
                captionAvailable: dto.captionAvailable || false,
                certificateAvailable: dto.certificateAvailable || false,
                features: dto.features || [],
                price: dto.price || 0,
                priceModel,
                isPublished: false, // Always start as unpublished
                isPremium: dto.isPremium || false,
            },
            include: {
                teacher: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        return newClass;
    }

    /**
     * Update an existing class
     */
    async update(id: string, dto: UpdateClassDto) {
        const classItem = await this.prisma.class.findUnique({
            where: { id },
        });

        if (!classItem) {
            throw new NotFoundException('Class not found');
        }

        // If updating teacherProfileId, validate it exists
        if (dto.teacherProfileId && dto.teacherProfileId !== classItem.teacherProfileId) {
            const teacher = await this.prisma.teacherProfile.findUnique({
                where: { id: dto.teacherProfileId },
            });
            if (!teacher) {
                throw new NotFoundException('Teacher profile not found');
            }
        }

        const updatedClass = await this.prisma.class.update({
            where: { id },
            data: dto,
            include: {
                teacher: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        return updatedClass;
    }

    /**
     * Soft delete a class (set isActive = false)
     */
    async remove(id: string) {
        const classItem = await this.prisma.class.findUnique({
            where: { id },
        });

        if (!classItem) {
            throw new NotFoundException('Class not found');
        }

        await this.prisma.class.update({
            where: { id },
            data: { isActive: false },
        });

        return { message: 'Class deleted successfully' };
    }

    /**
     * Publish or unpublish a class with validation
     */
    async publish(id: string, dto: PublishClassDto) {
        const classItem = await this.prisma.class.findUnique({
            where: { id },
            include: {
                sections: {
                    include: {
                        lessons: true,
                    },
                },
                resources: true,
            },
        });

        if (!classItem) {
            throw new NotFoundException('Class not found');
        }

        // Validate publishing requirements
        if (dto.isPublished) {
            // Check required fields
            if (!classItem.title || !classItem.descriptionShort || !classItem.subject || !classItem.jenjang) {
                throw new BadRequestException(
                    'Cannot publish: Missing required fields (title, descriptionShort, subject, jenjang)',
                );
            }

            // For ONLINE_COURSE, must have sections and lessons
            if (classItem.teachingType === TeachingType.ONLINE_COURSE) {
                if (classItem.sections.length === 0) {
                    throw new BadRequestException(
                        'Cannot publish ONLINE_COURSE: Must have at least one section',
                    );
                }

                const hasLessons = classItem.sections.some((section) => section.lessons.length > 0);
                if (!hasLessons) {
                    throw new BadRequestException(
                        'Cannot publish ONLINE_COURSE: Each section must have at least one lesson',
                    );
                }
            }
        }

        // Update publish status
        const updated = await this.prisma.class.update({
            where: { id },
            data: { isPublished: dto.isPublished },
        });

        return updated;
    }

    /**
     * Calculate statistics for a class
     */
    async calculateStatistics(classId: string) {
        const classItem = await this.prisma.class.findUnique({
            where: { id: classId },
            include: {
                enrollments: true,
                feedback: true,
                sections: {
                    include: {
                        lessons: true,
                    },
                },
                completions: true,
            },
        });

        if (!classItem) {
            throw new NotFoundException('Class not found');
        }

        // Total enrollments
        const totalEnrollments = classItem.enrollments.length;

        // Total completions
        const totalCompletions = classItem.completions.length;

        // Average rating
        const ratings = classItem.feedback.map((f) => f.rating);
        const averageRating = ratings.length > 0
            ? ratings.reduce((acc, r) => acc + r, 0) / ratings.length
            : 0;

        // Rating distribution
        const ratingDistribution = {
            5: ratings.filter((r) => r === 5).length,
            4: ratings.filter((r) => r === 4).length,
            3: ratings.filter((r) => r === 3).length,
            2: ratings.filter((r) => r === 2).length,
            1: ratings.filter((r) => r === 1).length,
        };

        // Total lessons and duration (for ONLINE_COURSE)
        let totalLessons = 0;
        let totalDurationMinutes = 0;

        if (classItem.teachingType === TeachingType.ONLINE_COURSE) {
            classItem.sections.forEach((section) => {
                totalLessons += section.lessons.length;
                section.lessons.forEach((lesson) => {
                    totalDurationMinutes += lesson.durationMinutes || 0;
                });
            });
        }

        return {
            totalEnrollments,
            totalCompletions,
            averageRating: parseFloat(averageRating.toFixed(2)),
            totalReviews: ratings.length,
            ratingDistribution,
            totalLessons,
            totalDurationMinutes,
            totalDurationHours: parseFloat((totalDurationMinutes / 60).toFixed(2)),
        };
    }

    /**
     * Get curriculum structure (sections + lessons) for a class
     */
    async getCurriculum(classId: string) {
        const classItem = await this.prisma.class.findUnique({
            where: { id: classId },
            include: {
                sections: {
                    orderBy: { order: 'asc' },
                    include: {
                        lessons: {
                            orderBy: { order: 'asc' },
                        },
                    },
                },
            },
        });

        if (!classItem) {
            throw new NotFoundException('Class not found');
        }

        if (classItem.teachingType !== TeachingType.ONLINE_COURSE) {
            throw new BadRequestException(
                'Curriculum is only available for ONLINE_COURSE teaching type',
            );
        }

        return classItem.sections;
    }
}
