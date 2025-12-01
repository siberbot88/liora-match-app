import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MidtransService } from './midtrans.service';
import { NotificationsService } from '../notifications/notifications.service';
import { UserRole, BookingStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
    constructor(
        private prisma: PrismaService,
        private midtrans: MidtransService,
        private notifications: NotificationsService,
    ) { }

    async createPayment(userId: string, bookingId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { studentProfile: true },
        });

        if (!user || user.role !== UserRole.STUDENT || !user.studentProfile) {
            throw new ForbiddenException('Only students can create payments');
        }

        // Get booking
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                teacher: {
                    include: { user: true },
                },
                subject: true,
            },
        });

        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        if (booking.studentProfileId !== user.studentProfile.id) {
            throw new ForbiddenException('You can only pay for your own bookings');
        }

        if (booking.status !== BookingStatus.PENDING) {
            throw new BadRequestException(`Cannot pay for booking with status: ${booking.status}`);
        }

        // Check if payment already exists
        const existingTx = await this.prisma.transaction.findUnique({
            where: { bookingId },
        });

        if (existingTx) {
            throw new BadRequestException('Payment already created for this booking');
        }

        // Create orderId
        const orderId = `BOOKING-${bookingId}-${Date.now()}`;

        // Create Midtrans transaction
        const midtransResponse = await this.midtrans.createTransaction(
            orderId,
            booking.totalPrice,
            {
                first_name: user.name,
                email: user.email,
                phone: user.phone || '08123456789',
            },
        );

        // Save transaction to database
        const transaction = await this.prisma.transaction.create({
            data: {
                bookingId,
                provider: 'midtrans',
                providerRef: orderId,
                amount: booking.totalPrice,
                status: PaymentStatus.PENDING,
                metadata: {
                    snapToken: midtransResponse.token,
                    redirectUrl: midtransResponse.redirect_url,
                },
            },
        });

        return {
            transactionId: transaction.id,
            orderId,
            snapToken: midtransResponse.token,
            redirectUrl: midtransResponse.redirect_url,
            amount: booking.totalPrice,
        };
    }

    async handleWebhook(payload: any) {
        const {
            order_id,
            transaction_status,
            fraud_status,
            status_code,
            gross_amount,
            signature_key,
        } = payload;

        // Verify signature
        const isValid = this.midtrans.verifySignature(
            order_id,
            status_code,
            gross_amount,
            signature_key,
        );

        if (!isValid) {
            throw new BadRequestException('Invalid signature');
        }

        // Get transaction
        const transaction = await this.prisma.transaction.findUnique({
            where: { providerRef: order_id },
            include: {
                booking: {
                    include: {
                        student: { include: { user: true } },
                        teacher: { include: { user: true } },
                    },
                },
            },
        });

        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }

        // Update status based on Midtrans status
        let status: PaymentStatus;
        let bookingStatus: BookingStatus;

        if (transaction_status === 'capture' || transaction_status === 'settlement') {
            if (fraud_status === 'accept' || !fraud_status) {
                status = PaymentStatus.PAID;
                bookingStatus = BookingStatus.CONFIRMED;
            } else {
                status = PaymentStatus.FAILED;
                bookingStatus = BookingStatus.CANCELLED;
            }
        } else if (transaction_status === 'pending') {
            status = PaymentStatus.PENDING;
            bookingStatus = BookingStatus.PENDING;
        } else if (transaction_status === 'deny' || transaction_status === 'cancel') {
            status = PaymentStatus.FAILED;
            bookingStatus = BookingStatus.CANCELLED;
        } else if (transaction_status === 'expire') {
            status = PaymentStatus.EXPIRED;
            bookingStatus = BookingStatus.CANCELLED;
        } else {
            status = PaymentStatus.FAILED;
            bookingStatus = BookingStatus.CANCELLED;
        }

        // Update transaction
        await this.prisma.transaction.update({
            where: { id: transaction.id },
            data: { status },
        });

        // Update booking
        await this.prisma.booking.update({
            where: { id: transaction.bookingId },
            data: { status: bookingStatus },
        });

        // Send notifications
        if (status === PaymentStatus.PAID) {
            // Notify student
            await this.notifications.sendNotification({
                userId: transaction.booking.student.userId,
                title: 'Pembayaran Berhasil',
                body: 'Pembayaran booking Anda telah dikonfirmasi!',
                type: 'PAYMENT_SUCCESS',
                data: { bookingId: transaction.bookingId },
            });

            // Notify teacher
            await this.notifications.sendNotification({
                userId: transaction.booking.teacher.userId,
                title: 'Booking Terkonfirmasi',
                body: `${transaction.booking.student.user.name} telah membayar booking`,
                type: 'BOOKING_CONFIRMED',
                data: { bookingId: transaction.bookingId },
            });
        }

        return { message: 'Webhook processed successfully' };
    }

    async getTransaction(userId: string, transactionId: string) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id: transactionId },
            include: {
                booking: {
                    include: {
                        student: { include: { user: true } },
                        teacher: { include: { user: true } },
                        subject: true,
                    },
                },
            },
        });

        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }

        // Verify access
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { studentProfile: true, teacherProfile: true },
        });

        const isStudent = transaction.booking.studentProfileId === user.studentProfile?.id;
        const isTeacher = transaction.booking.teacherProfileId === user.teacherProfile?.id;

        if (!isStudent && !isTeacher) {
            throw new ForbiddenException('Cannot access this transaction');
        }

        return transaction;
    }

    async getMyTransactions(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { studentProfile: true },
        });

        if (!user || !user.studentProfile) {
            return [];
        }

        const transactions = await this.prisma.transaction.findMany({
            where: {
                booking: {
                    studentProfileId: user.studentProfile.id,
                },
            },
            include: {
                booking: {
                    include: {
                        teacher: { include: { user: true } },
                        subject: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return transactions;
    }
}
