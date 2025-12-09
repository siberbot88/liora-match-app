import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryTransactionsDto } from './dto/query-transactions.dto';
import { RefundTransactionDto } from './dto/refund-transaction.dto';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class TransactionsService {
    constructor(private prisma: PrismaService) { }

    async findAll(query: QueryTransactionsDto) {
        const { status, studentId, teacherId, dateFrom, dateTo, search, page = 1, limit = 10 } = query;
        const skip = (page - 1) * limit;

        const where: any = {};

        if (status) {
            where.status = status;
        }

        if (search) {
            where.OR = [
                { providerRef: { contains: search } },
                { booking: { student: { user: { name: { contains: search } } } } },
                { booking: { teacher: { user: { name: { contains: search } } } } },
            ];
        }

        if (studentId) {
            where.booking = {
                ...where.booking,
                studentProfileId: studentId,
            };
        }

        if (teacherId) {
            where.booking = {
                ...where.booking,
                teacherProfileId: teacherId,
            };
        }

        if (dateFrom || dateTo) {
            where.createdAt = {};
            if (dateFrom) where.createdAt.gte = new Date(dateFrom);
            if (dateTo) where.createdAt.lte = new Date(dateTo);
        }

        const [transactions, total] = await Promise.all([
            this.prisma.transaction.findMany({
                where,
                skip,
                take: limit,
                include: {
                    booking: {
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
                            teacher: {
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
                            class: {
                                select: {
                                    id: true,
                                    title: true,
                                },
                            },
                            subject: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.transaction.count({ where }),
        ]);

        // Calculate summary
        const stats = await this.prisma.transaction.aggregate({
            where,
            _sum: {
                amount: true,
            },
        });

        const summary = {
            totalRevenue: stats._sum.amount || 0,
            totalPaid: 0,
            totalPending: 0,
            totalFailed: 0,
        };

        // Calculate by status
        const byStatus = await this.prisma.transaction.groupBy({
            by: ['status'],
            where,
            _sum: {
                amount: true,
            },
        });

        byStatus.forEach((item) => {
            if (item.status === PaymentStatus.PAID) {
                summary.totalPaid = item._sum.amount || 0;
            } else if (item.status === PaymentStatus.PENDING) {
                summary.totalPending = item._sum.amount || 0;
            } else if (item.status === PaymentStatus.FAILED) {
                summary.totalFailed = item._sum.amount || 0;
            }
        });

        return {
            data: transactions,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
            summary,
        };
    }

    async findOne(id: string) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id },
            include: {
                booking: {
                    include: {
                        student: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true,
                                        phone: true,
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
                                    },
                                },
                            },
                        },
                        class: {
                            select: {
                                id: true,
                                title: true,
                            },
                        },
                        subject: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }

        return transaction;
    }

    async processRefund(id: string, dto: RefundTransactionDto, adminId: string) {
        const transaction = await this.findOne(id);

        // Validate transaction can be refunded
        if (transaction.status !== PaymentStatus.PAID) {
            throw new BadRequestException('Only paid transactions can be refunded');
        }

        if (transaction.isRefunded) {
            throw new BadRequestException('Transaction has already been refunded');
        }

        // Determine refund amount
        const refundAmount = dto.amount !== undefined ? dto.amount : transaction.amount;

        if (refundAmount > transaction.amount) {
            throw new BadRequestException('Refund amount cannot exceed transaction amount');
        }

        if (refundAmount <= 0) {
            throw new BadRequestException('Refund amount must be greater than 0');
        }

        // Process refund
        const updatedTransaction = await this.prisma.transaction.update({
            where: { id },
            data: {
                isRefunded: true,
                refundedAmount: refundAmount,
                refundReason: dto.reason,
                refundedAt: new Date(),
                refundedBy: adminId,
            },
            include: {
                booking: {
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
                    },
                },
            },
        });

        return {
            success: true,
            message: 'Refund processed successfully',
            transaction: updatedTransaction,
        };
    }

    async getStats(period?: string) {
        const now = new Date();
        let dateFilter: any = {};

        switch (period) {
            case 'today':
                const startOfDay = new Date(now.setHours(0, 0, 0, 0));
                dateFilter = { gte: startOfDay };
                break;
            case 'week':
                const startOfWeek = new Date(now.setDate(now.getDate() - 7));
                dateFilter = { gte: startOfWeek };
                break;
            case 'month':
                const startOfMonth = new Date(now.setDate(1));
                startOfMonth.setHours(0, 0, 0, 0);
                dateFilter = { gte: startOfMonth };
                break;
            case 'year':
                const startOfYear = new Date(now.getFullYear(), 0, 1);
                dateFilter = { gte: startOfYear };
                break;
        }

        const where = dateFilter.gte ? { createdAt: dateFilter } : {};

        const [stats, byStatus, totalCount] = await Promise.all([
            this.prisma.transaction.aggregate({
                where,
                _sum: { amount: true },
                _avg: { amount: true },
            }),
            this.prisma.transaction.groupBy({
                by: ['status'],
                where,
                _count: true,
            }),
            this.prisma.transaction.count({ where }),
        ]);

        const statusCounts: any = {
            PAID: 0,
            PENDING: 0,
            FAILED: 0,
        };

        byStatus.forEach((item) => {
            statusCounts[item.status] = item._count;
        });

        const successCount = statusCounts.PAID || 0;
        const successRate = totalCount > 0 ? (successCount / totalCount) * 100 : 0;

        return {
            totalRevenue: stats._sum.amount || 0,
            totalTransactions: totalCount,
            successRate: parseFloat(successRate.toFixed(2)),
            averageTransaction: stats._avg.amount || 0,
            byStatus: statusCounts,
        };
    }
}
