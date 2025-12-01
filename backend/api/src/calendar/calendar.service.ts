import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class CalendarService {
    constructor(private prisma: PrismaService) { }

    async getMyCalendar(userId: string, month: number, year: number) {
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

        if (user.role === UserRole.STUDENT && user.studentProfile) {
            return this.getStudentCalendar(user.studentProfile.id, month, year);
        } else if (user.role === UserRole.TEACHER && user.teacherProfile) {
            return this.getTeacherCalendar(user.teacherProfile.id, month, year);
        }

        return { bookings: [], sessions: [] };
    }

    private async getStudentCalendar(studentProfileId: string, month: number, year: number) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        // Get student's bookings
        const bookings = await this.prisma.booking.findMany({
            where: {
                studentProfileId,
                scheduledAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                teacher: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                avatar: true,
                                avatarUrl: true,
                            },
                        },
                    },
                },
                subject: true,
            },
            orderBy: {
                scheduledAt: 'asc',
            },
        });

        // Get enrolled class sessions
        const enrollments = await this.prisma.classEnrollment.findMany({
            where: {
                studentProfileId,
                isActive: true,
            },
            include: {
                class: {
                    include: {
                        sessions: {
                            where: {
                                scheduledAt: {
                                    gte: startDate,
                                    lte: endDate,
                                },
                            },
                            include: {
                                class: {
                                    include: {
                                        subject: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        const sessions = enrollments.flatMap((e) => e.class.sessions);

        return {
            bookings,
            sessions,
            month,
            year,
        };
    }

    private async getTeacherCalendar(teacherProfileId: string, month: number, year: number) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        // Get teacher's bookings
        const bookings = await this.prisma.booking.findMany({
            where: {
                teacherProfileId,
                scheduledAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                student: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                avatar: true,
                                avatarUrl: true,
                            },
                        },
                    },
                },
                subject: true,
            },
            orderBy: {
                scheduledAt: 'asc',
            },
        });

        // Get teacher's sessions
        const sessions = await this.prisma.classSession.findMany({
            where: {
                teacherProfileId,
                scheduledAt: {
                    gte: startDate,
                    lte: endDate,
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
        });

        return {
            bookings,
            sessions,
            month,
            year,
        };
    }

    async getTeacherPublicCalendar(teacherId: string, month: number, year: number) {
        // Find teacher profile
        const teacher = await this.prisma.teacherProfile.findFirst({
            where: { userId: teacherId },
        });

        if (!teacher) {
            throw new NotFoundException('Teacher not found');
        }

        // Return only availability and booked slots (no personal details)
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        const availabilitySlots = await this.prisma.availabilitySlot.findMany({
            where: {
                teacherProfileId: teacher.id,
                isActive: true,
            },
        });

        const bookedSlots = await this.prisma.booking.findMany({
            where: {
                teacherProfileId: teacher.id,
                scheduledAt: {
                    gte: startDate,
                    lte: endDate,
                },
                status: {
                    in: ['PENDING', 'CONFIRMED'],
                },
            },
            select: {
                scheduledAt: true,
                duration: true,
            },
        });

        return {
            availabilitySlots,
            bookedSlots,
            month,
            year,
        };
    }

    async generateBookingCalendarLink(userId: string, bookingId: string) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                student: { include: { user: true } },
                teacher: { include: { user: true } },
                subject: true,
            },
        });

        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        // Verify user has access
        if (booking.student.userId !== userId && booking.teacher.userId !== userId) {
            throw new ForbiddenException('Cannot access this booking');
        }

        const startTime = new Date(booking.scheduledAt);
        const endTime = new Date(startTime.getTime() + booking.duration * 60000);

        // Format for Google Calendar
        const formatDate = (date: Date) => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };

        const params = new URLSearchParams({
            action: 'TEMPLATE',
            text: `Belajar ${booking.subject.name} dengan ${booking.teacher.user.name}`,
            dates: `${formatDate(startTime)}/${formatDate(endTime)}`,
            details: `Booking pembelajaran ${booking.subject.name}\nGuru: ${booking.teacher.user.name}\nMode: ${booking.mode}`,
            location: booking.mode === 'ONLINE' ? 'Online' : booking.mode,
        });

        const googleCalendarUrl = `https://calendar.google.com/calendar/render?${params.toString()}`;

        return {
            calendarUrl: googleCalendarUrl,
            booking,
        };
    }
}
