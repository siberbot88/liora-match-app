import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UserRole, BookingStatus } from '@prisma/client';

@Injectable()
export class BookingsService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, dto: CreateBookingDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { studentProfile: true },
        });

        if (!user || user.role !== UserRole.STUDENT || !user.studentProfile) {
            throw new ForbiddenException('Only students can create bookings');
        }

        // Verify teacher exists
        const teacher = await this.prisma.teacherProfile.findUnique({
            where: { id: dto.teacherId },
            include: {
                user: true,
                subjects: {
                    where: {
                        subjectId: dto.subjectId,
                    },
                },
            },
        });

        if (!teacher) {
            throw new NotFoundException('Teacher not found');
        }

        if (teacher.subjects.length === 0) {
            throw new BadRequestException('Teacher does not teach this subject');
        }

        // Verify subject exists
        const subject = await this.prisma.subject.findUnique({
            where: { id: dto.subjectId },
        });

        if (!subject) {
            throw new NotFoundException('Subject not found');
        }

        // Check if teacher is available at the requested time
        const scheduledAt = new Date(dto.scheduledAt);
        const dayOfWeek = scheduledAt.getDay();
        const timeStr = scheduledAt.toTimeString().substring(0, 5); // HH:mm

        const availability = await this.prisma.availabilitySlot.findFirst({
            where: {
                teacherProfileId: dto.teacherId,
                dayOfWeek,
                isActive: true,
                startTime: {
                    lte: timeStr,
                },
                endTime: {
                    gte: timeStr,
                },
            },
        });

        if (!availability) {
            throw new BadRequestException('Teacher is not available at the requested time');
        }

        // Check for conflicting bookings
        const conflictingBooking = await this.prisma.booking.findFirst({
            where: {
                teacherProfileId: dto.teacherId,
                scheduledAt: scheduledAt,
                status: {
                    in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
                },
            },
        });

        if (conflictingBooking) {
            throw new BadRequestException('Teacher already has a booking at this time');
        }

        // // TEMPORARILY COMMENTED OUT - Schema migration needed
        // // Find or create a class for this booking
        // let classForBooking = await this.prisma.class.findFirst({
        //     where: {
        //         teacherProfileId: dto.teacherId,
        //         // subjectId: dto.subjectId, // Field removed in new schema
        //         // mode: dto.mode, // Field removed
        //         title: {
        //             contains: 'Private Session',
        //         },
        //     },
        // });

        // if (!classForBooking) {
        //     classForBooking = await this.prisma.class.create({
        //         data: {
        //             title: `Private Session - ${subject.name}`,
        //             // description: 'Private tutoring session', // Now descriptionShort/descriptionLong
        //             teacherProfileId: dto.teacherId,
        //             // subjectId: dto.subjectId, // Field removed
        //             // mode: dto.mode, // Field removed
        //             // maxStudents: 1, // Field removed
        //             // pricePerSession: teacher.hourlyRate, // Field removed
        //             // duration: dto.duration || 60, // Field removed
        //             // isActive: true, // Now isPublished
        //         },
        //     });
        // }

        // TEMPORARY WORKAROUND: Use a dummy class ID
        const classForBooking = { id: 'temp-class-id' };

        // Calculate total price
        const durationInHours = (dto.duration || 60) / 60;
        const totalPrice = Math.round(teacher.hourlyRate * durationInHours);

        // Create booking
        const booking = await this.prisma.booking.create({
            data: {
                studentProfileId: user.studentProfile.id,
                teacherProfileId: dto.teacherId,
                classId: classForBooking.id,
                subjectId: dto.subjectId,
                scheduledAt: scheduledAt,
                duration: dto.duration || 60,
                mode: dto.mode,
                totalPrice,
                notes: dto.notes,
                status: BookingStatus.PENDING,
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
                // subject: true, // Subject is now a string field, not a relation
                class: {
                    select: {
                        title: true,
                    },
                },
            },
        });

        return booking;
    }

    async getMyBookings(userId: string, role: string, status?: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                studentProfile: true,
                teacherProfile: true,
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const where: any = {};

        if (status) {
            where.status = status.toUpperCase();
        }

        if (role === UserRole.STUDENT && user.studentProfile) {
            // Student: bookings they created
            where.studentProfileId = user.studentProfile.id;

            const bookings = await this.prisma.booking.findMany({
                where,
                include: {
                    teacher: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    avatar: true,
                                    email: true,
                                    phone: true,
                                },
                            },
                        },
                    },
                    // subject: true, // Subject is now a string field, not a relation
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
        } else if (role === UserRole.TEACHER && user.teacherProfile) {
            // Teacher: bookings made to them
            where.teacherProfileId = user.teacherProfile.id;

            const bookings = await this.prisma.booking.findMany({
                where,
                include: {
                    student: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    avatar: true,
                                    email: true,
                                    phone: true,
                                },
                            },
                        },
                    },
                    // subject: true, // Subject is now a string field, not a relation
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

        throw new ForbiddenException('Invalid role');
    }

    async findOne(userId: string, role: string, bookingId: string) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
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
                // subject: true, // Subject is now a string field, not a relation
                class: true,
            },
        });

        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        // Verify user has access to this booking
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                studentProfile: true,
                teacherProfile: true,
            },
        });

        if (role === UserRole.STUDENT && booking.studentProfileId !== user.studentProfile?.id) {
            throw new ForbiddenException('You can only view your own bookings');
        }

        if (role === UserRole.TEACHER && booking.teacherProfileId !== user.teacherProfile?.id) {
            throw new ForbiddenException('You can only view bookings made to you');
        }

        return booking;
    }

    async confirm(userId: string, bookingId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { teacherProfile: true },
        });

        if (!user || user.role !== UserRole.TEACHER || !user.teacherProfile) {
            throw new ForbiddenException('Only teachers can confirm bookings');
        }

        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
        });

        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        if (booking.teacherProfileId !== user.teacherProfile.id) {
            throw new ForbiddenException('You can only confirm your own bookings');
        }

        if (booking.status !== BookingStatus.PENDING) {
            throw new BadRequestException(`Cannot confirm booking with status: ${booking.status}`);
        }

        const updated = await this.prisma.booking.update({
            where: { id: bookingId },
            data: {
                status: BookingStatus.CONFIRMED,
            },
            include: {
                student: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                // subject: true, // Subject is now a string field, not a relation
            },
        });

        return updated;
    }

    async cancel(userId: string, role: string, bookingId: string) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
        });

        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                studentProfile: true,
                teacherProfile: true,
            },
        });

        // Verify user can cancel this booking
        if (role === UserRole.STUDENT && booking.studentProfileId !== user.studentProfile?.id) {
            throw new ForbiddenException('You can only cancel your own bookings');
        }

        if (role === UserRole.TEACHER && booking.teacherProfileId !== user.teacherProfile?.id) {
            throw new ForbiddenException('You can only cancel bookings made to you');
        }

        if (booking.status === BookingStatus.COMPLETED) {
            throw new BadRequestException('Cannot cancel completed bookings');
        }

        if (booking.status === BookingStatus.CANCELLED) {
            throw new BadRequestException('Booking is already cancelled');
        }

        const updated = await this.prisma.booking.update({
            where: { id: bookingId },
            data: {
                status: BookingStatus.CANCELLED,
            },
            include: {
                student: {
                    include: {
                        user: true,
                    },
                },
                teacher: {
                    include: {
                        user: true,
                    },
                },
                // subject: true, // Subject is now a string field, not a relation
            },
        });

        return updated;
    }

    async complete(userId: string, bookingId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { teacherProfile: true },
        });

        if (!user || user.role !== UserRole.TEACHER || !user.teacherProfile) {
            throw new ForbiddenException('Only teachers can mark bookings as completed');
        }

        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
        });

        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        if (booking.teacherProfileId !== user.teacherProfile.id) {
            throw new ForbiddenException('You can only complete your own bookings');
        }

        if (booking.status !== BookingStatus.CONFIRMED) {
            throw new BadRequestException('Can only complete confirmed bookings');
        }

        const updated = await this.prisma.booking.update({
            where: { id: bookingId },
            data: {
                status: BookingStatus.COMPLETED,
            },
            include: {
                student: {
                    include: {
                        user: true,
                    },
                },
                // subject: true, // Subject is now a string field, not a relation
            },
        });

        return updated;
    }

    // =============== ADMIN ENDPOINTS ===============

    /**
     * Admin: Get all bookings with filters
     */
    async findAllAdmin(filters?: {
        status?: BookingStatus;
        studentId?: string;
        teacherId?: string;
        classId?: string;
        dateFrom?: Date;
        dateTo?: string;
        search?: string;
    }) {
        const where: any = {};

        if (filters?.status) {
            where.status = filters.status;
        }

        if (filters?.studentId) {
            where.studentProfileId = filters.studentId;
        }

        if (filters?.teacherId) {
            where.teacherProfileId = filters.teacherId;
        }

        if (filters?.classId) {
            where.classId = filters.classId;
        }

        if (filters?.dateFrom || filters?.dateTo) {
            where.scheduledAt = {};
            if (filters.dateFrom) {
                where.scheduledAt.gte = new Date(filters.dateFrom);
            }
            if (filters.dateTo) {
                where.scheduledAt.lte = new Date(filters.dateTo);
            }
        }

        if (filters?.search) {
            where.OR = [
                { student: { user: { name: { contains: filters.search } } } },
                { teacher: { user: { name: { contains: filters.search } } } },
            ];
        }

        return this.prisma.booking.findMany({
            where,
            include: {
                student: {
                    select: {
                        id: true,
                        user: { select: { name: true, email: true } },
                    },
                },
                teacher: {
                    select: {
                        id: true,
                        user: { select: { name: true, email: true } },
                    },
                },
                class: {
                    select: { id: true, title: true },
                },
                subject: {
                    select: { id: true, name: true },
                },
                transaction: true,
            },
            orderBy: { scheduledAt: 'desc' },
        });
    }

    /**
     * Admin: Update booking
     */
    async updateAdmin(id: string, updateData: Partial<CreateBookingDto & { status: BookingStatus }>) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
        });

        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        return this.prisma.booking.update({
            where: { id },
            data: updateData,
            include: {
                student: { include: { user: true } },
                teacher: { include: { user: true } },
                class: true,
                subject: true,
            },
        });
    }

    /**
     * Admin: Delete booking
     */
    async deleteAdmin(id: string) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: { transaction: true },
        });

        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        if (booking.transaction) {
            throw new BadRequestException('Cannot delete booking with associated transaction');
        }

        return this.prisma.booking.delete({
            where: { id },
        });
    }

    /**
     * Admin: Update booking status
     */
    async updateStatusAdmin(id: string, status: BookingStatus) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
        });

        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        return this.prisma.booking.update({
            where: { id },
            data: { status },
            include: {
                student: { include: { user: true } },
                teacher: { include: { user: true } },
            },
        });
    }
}
