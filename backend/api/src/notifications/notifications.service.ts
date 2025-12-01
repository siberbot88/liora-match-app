import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FirebaseService } from '../firebase/firebase.service';
import { DevicesService } from '../devices/devices.service';
import { NotificationType } from '@prisma/client';

interface SendNotificationDto {
    userId: string;
    title: string;
    body: string;
    type: NotificationType | string;
    data?: any;
}

@Injectable()
export class NotificationsService {
    constructor(
        private prisma: PrismaService,
        private firebase: FirebaseService,
        private devices: DevicesService,
    ) { }

    async sendNotification(dto: SendNotificationDto) {
        // Save to database
        const notification = await this.prisma.notification.create({
            data: {
                userId: dto.userId,
                title: dto.title,
                body: dto.body,
                type: dto.type as NotificationType,
                data: dto.data || {},
            },
        });

        // Get user's device tokens
        const tokens = await this.devices.getUserTokens(dto.userId);

        if (tokens.length > 0) {
            // Send push notification
            try {
                await this.firebase.sendPushNotification(tokens, {
                    title: dto.title,
                    body: dto.body,
                    data: {
                        type: dto.type,
                        notificationId: notification.id,
                        ...dto.data,
                    },
                });
            } catch (error) {
                console.error('Failed to send push notification:', error);
            }
        }

        return notification;
    }

    async getMyNotifications(userId: string) {
        const notifications = await this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });

        return notifications;
    }

    async getUnreadCount(userId: string) {
        const count = await this.prisma.notification.count({
            where: {
                userId,
                isRead: false,
            },
        });

        return { unreadCount: count };
    }

    async markAsRead(userId: string, notificationId: string) {
        const notification = await this.prisma.notification.findUnique({
            where: { id: notificationId },
        });

        if (!notification) {
            throw new NotFoundException('Notification not found');
        }

        if (notification.userId !== userId) {
            throw new ForbiddenException('Cannot access this notification');
        }

        await this.prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true },
        });

        return { message: 'Notification marked as read' };
    }

    async markAllAsRead(userId: string) {
        await this.prisma.notification.updateMany({
            where: {
                userId,
                isRead: false,
            },
            data: { isRead: true },
        });

        return { message: 'All notifications marked as read' };
    }
}
