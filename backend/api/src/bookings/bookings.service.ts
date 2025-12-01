import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UserRole, BookingStatus } from '@prisma/client';

@Injectable()
export class BookingsService {
    constructor(private prisma: PrismaService) { }

    async findMyBookings(userId: string) {
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

        if (user.role === UserRole.STUDENT) {
            // Get bookings created by student
            if (!user.studentProfile) {
                throw new NotFoundException('Student profile not found');
            }

            return this.prisma.booking.findMany({
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
                    scheduledAt: 'desc',
                },
            });
        } else if (user.role === UserRole.TEACHER) {
            // Get bookings for teacher
            if (!user.teacherProfile) {
                throw new NotFoundException('Teacher profile not found');
            }

            return this.prisma.booking.findMany({
                where: {
                    teacherProfileId: user.teacherProfile.id,
                },
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
                },
                orderBy: {
                    scheduledAt: 'desc',
                },
            });
        }

        throw new ForbiddenException('Invalid user role');
    }

    async findOne(userId: string, bookingId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                studentProfile: true,
                teacherProfile: true,
            },
        });

        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
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
                subject: true,
            },
        });

        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        // Check if user has access to this booking
        const isStudent = user.studentProfile?.id === booking.studentProfileId;
        const isTeacher = user.teacherProfile?.id === booking.teacherProfileId;

        if (!isStudent && !isTeacher) {
            throw new ForbiddenException('You do not have access to this booking');
        }

        return booking;
    }

    async create(userId: string, dto: CreateBookingDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { studentProfile: true },
        });

        if (!user || user.role !== UserRole.STUDENT) {
            throw new ForbiddenException('Only students can create bookings');
        }

        if (!user.studentProfile) {
            throw new NotFoundException('Student profile not found');
        }

        // Verify teacher exists
        const teacher = await this.prisma.teacherProfile.findUnique({
            where: { id: dto.teacherId },
            include: { user: true },
        });

        if (!teacher) {
            throw new NotFoundException('Teacher not found');
        }

        // Verify subject exists
        const subject = await this.prisma.subject.findUnique({
            where: { id: dto.subjectId },
        });

        if (!subject) {
            throw new NotFoundException('Subject not found');
        }

        // Find or create a class for this booking
        // For private bookings, we can create a temporary class
        let classForBooking = await this.prisma.class.findFirst({
            where: {
                teacherProfileId: dto.teacherId,
                subjectId: dto.subjectId,
                mode: dto.mode || 'ONLINE',
                isActive: true,
            },
        });

        if (!classForBooking) {
            // Create a new class for private booking
            classForBooking = await this.prisma.class.create({
                data: {
                    teacherProfileId: dto.teacherId,
                    subjectId: dto.subjectId,
                    title: `Private Session - ${subject.name}`,
                    mode: dto.mode || 'ONLINE',
                    maxStudents: 1,
                    pricePerSession: teacher.hourlyRate || 50000,
                    duration: 60, // Default 60 minutes
                },
            });
        }

        // Create booking with PENDING status
        const booking = await this.prisma.booking.create({
            data: {
                classId: classForBooking.id,
                studentProfileId: user.studentProfile.id,
                teacherProfileId: dto.teacherId,
                subjectId: dto.subjectId,
                scheduledAt: new Date(dto.scheduledAt),
                duration: 60, // Default 60 minutes, can be made configurable
                totalPrice: teacher.hourlyRate || 50000,
                mode: dto.mode,
                notes: dto.notes,
                status: BookingStatus.PENDING,
            },
            include: {
                class: {
                    include: {
                        subject: true,
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
                subject: true,
            },
        });

        return booking;
    }

    async confirm(userId: string, bookingId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { teacherProfile: true },
        });

        if (!user || user.role !== UserRole.TEACHER) {
            throw new ForbiddenException('Only teachers can confirm bookings');
        }

        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
        });

        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        // Verify ownership
        if (booking.teacherProfileId !== user.teacherProfile.id) {
            throw new ForbiddenException('You can only confirm your own bookings');
        }

        if (booking.status !== BookingStatus.PENDING) {
            throw new BadRequestException('Only pending bookings can be confirmed');
        }

        const updatedBooking = await this.prisma.booking.update({
            where: { id: bookingId },
            data: {
                status: BookingStatus.CONFIRMED,
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
                subject: true,
            },
        });

        return updatedBooking;
    }

    async cancel(userId: string, bookingId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                studentProfile: true,
                teacherProfile: true,
            },
        });

        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
        });

        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        // Check if user is the student who created it OR the teacher who receives it
        const isStudent = user.studentProfile?.id === booking.studentProfileId;
        const isTeacher = user.teacherProfile?.id === booking.teacherProfileId;

        if (!isStudent && !isTeacher) {
            throw new ForbiddenException('You do not have permission to cancel this booking');
        }

        if (booking.status === BookingStatus.COMPLETED) {
            throw new BadRequestException('Cannot cancel completed booking');
        }

        if (booking.status === BookingStatus.CANCELLED) {
            throw new BadRequestException('Booking is already cancelled');
        }

        const updatedBooking = await this.prisma.booking.update({
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
                subject: true,
            },
        });

        return updatedBooking;
    }
}
