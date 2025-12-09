import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { DashboardStatsDto } from './dto/dashboard-stats.dto';
import { UserRole, BookingStatus } from '@prisma/client';
import { subDays, subWeeks, subMonths, startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class AdminService {
    private readonly logger = new Logger(AdminService.name);

    constructor(
        private prisma: PrismaService,
        private redis: RedisService,
    ) { }

    async getDashboardStats(): Promise<DashboardStatsDto> {
        const cacheKey = 'dashboard:stats';
        const cached = await this.redis.get(cacheKey);

        if (cached) {
            this.logger.debug('Returning cached dashboard stats');
            return JSON.parse(cached);
        }

        this.logger.log('Calculating dashboard stats');

        const [users, classes, transactions, bookings, systemHealth] = await Promise.all([
            this.getUserStats(),
            this.getClassStats(),
            this.getTransactionStats(),
            this.getBookingStats(),
            this.getSystemHealth(),
        ]);

        const stats: DashboardStatsDto = {
            users,
            classes,
            transactions,
            bookings,
            systemHealth,
        };

        // Cache for 5 minutes
        await this.redis.set(cacheKey, JSON.stringify(stats), 300);

        return stats;
    }

    private async getUserStats() {
        const totalUsers = await this.prisma.user.count();

        const usersByRole = await this.prisma.user.groupBy({
            by: ['role'],
            _count: true,
        });

        const students = usersByRole.find(u => u.role === UserRole.STUDENT)?._count || 0;
        const teachers = usersByRole.find(u => u.role === UserRole.TEACHER)?._count || 0;
        const admins = usersByRole.find(u => u.role === UserRole.ADMIN)?._count || 0;

        // Calculate growth
        const yesterday = startOfDay(subDays(new Date(), 1));
        const weekAgo = startOfDay(subWeeks(new Date(), 1));
        const monthAgo = startOfDay(subMonths(new Date(), 1));

        const [dailyNew, weeklyNew, monthlyNew] = await Promise.all([
            this.prisma.user.count({ where: { createdAt: { gte: yesterday } } }),
            this.prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
            this.prisma.user.count({ where: { createdAt: { gte: monthAgo } } }),
        ]);

        return {
            total: totalUsers,
            students,
            teachers,
            admins,
            growth: {
                daily: dailyNew,
                weekly: weeklyNew,
                monthly: monthlyNew,
            },
        };
    }

    private async getClassStats() {
        const totalClasses = await this.prisma.class.count();
        const activeClasses = await this.prisma.class.count({
            where: { isPublished: true },
        });
        const draftClasses = await this.prisma.class.count({
            where: { isPublished: false },
        });

        const byTeachingType = await this.prisma.class.groupBy({
            by: ['teachingType'],
            _count: true,
        });

        const teachingTypeMap = byTeachingType.reduce((acc, item) => {
            acc[item.teachingType] = item._count;
            return acc;
        }, {} as Record<string, number>);

        return {
            total: totalClasses,
            active: activeClasses,
            draft: draftClasses,
            byTeachingType: teachingTypeMap,
        };
    }

    private async getTransactionStats() {
        // TODO: Implement when Transaction model is created
        // For now, return mock data
        return {
            today: {
                count: 0,
                amount: 0,
            },
            week: {
                count: 0,
                amount: 0,
            },
            month: {
                count: 0,
                amount: 0,
            },
            total: {
                count: 0,
                amount: 0,
            },
        };
    }

    private async getBookingStats() {
        const bookingsByStatus = await this.prisma.booking.groupBy({
            by: ['status'],
            _count: true,
        });

        return {
            pending: bookingsByStatus.find(b => b.status === BookingStatus.PENDING)?._count || 0,
            confirmed: bookingsByStatus.find(b => b.status === BookingStatus.CONFIRMED)?._count || 0,
            completed: bookingsByStatus.find(b => b.status === BookingStatus.COMPLETED)?._count || 0,
            cancelled: bookingsByStatus.find(b => b.status === BookingStatus.CANCELLED)?._count || 0,
        };
    }

    private async getSystemHealth() {
        try {
            // Check database
            await this.prisma.$queryRaw`SELECT 1`;
            const dbStatus = 'ok';

            // Check Redis
            const redisStatus = await this.redis.ping() ? 'ok' : 'down';

            // Get uptime (process uptime in seconds)
            const uptime = Math.floor(process.uptime());

            return {
                api: 'ok' as const,
                database: dbStatus as 'ok' | 'degraded' | 'down',
                redis: redisStatus as 'ok' | 'degraded' | 'down',
                uptime,
            };
        } catch (error) {
            this.logger.error('System health check failed:', error);
            return {
                api: 'ok' as const,
                database: 'down' as const,
                redis: 'down' as const,
                uptime: 0,
            };
        }
    }

    async getRecentActivities(limit: number = 50) {
        return this.prisma.activityLog.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                        role: true,
                    },
                },
            },
        });
    }

    async logActivity(data: {
        userId?: string;
        action: string;
        entity?: string;
        entityId?: string;
        metadata?: any;
        ipAddress?: string;
        userAgent?: string;
    }) {
        try {
            await this.prisma.activityLog.create({
                data,
            });
        } catch (error) {
            this.logger.error('Failed to log activity:', error);
        }
    }
}
