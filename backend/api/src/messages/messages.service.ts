import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class MessagesService {
    constructor(private prisma: PrismaService) { }

    async getMessageHistory(userId: string, otherUserId: string) {
        // Verify both users exist
        const [user, otherUser] = await Promise.all([
            this.prisma.user.findUnique({ where: { id: userId } }),
            this.prisma.user.findUnique({ where: { id: otherUserId } }),
        ]);

        if (!user || !otherUser) {
            throw new NotFoundException('User not found');
        }

        // Get messages between these two users
        const messages = await this.prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: userId },
                ],
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
                receiver: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        });

        // Mark messages as read
        await this.markMessagesAsRead(userId, otherUserId);

        return messages;
    }

    async sendMessage(senderId: string, dto: SendMessageDto) {
        // Verify receiver exists
        const receiver = await this.prisma.user.findUnique({
            where: { id: dto.receiverId },
        });

        if (!receiver) {
            throw new NotFoundException('Receiver not found');
        }

        const message = await this.prisma.message.create({
            data: {
                senderId,
                receiverId: dto.receiverId,
                content: dto.content,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
                receiver: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
            },
        });

        return message;
    }

    async getMyConversations(userId: string) {
        // Get all unique users that current user has chatted with
        const messages = await this.prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId },
                    { receiverId: userId },
                ],
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
                receiver: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Extract unique conversations
        const conversationsMap = new Map();

        for (const message of messages) {
            const otherUser = message.senderId === userId ? message.receiver : message.sender;

            if (!conversationsMap.has(otherUser.id)) {
                // Get unread count
                const unreadCount = await this.prisma.message.count({
                    where: {
                        senderId: otherUser.id,
                        receiverId: userId,
                        isRead: false,
                    },
                });

                conversationsMap.set(otherUser.id, {
                    user: otherUser,
                    lastMessage: message,
                    unreadCount,
                });
            }
        }

        return Array.from(conversationsMap.values());
    }

    async markMessagesAsRead(userId: string, senderId: string) {
        await this.prisma.message.updateMany({
            where: {
                senderId: senderId,
                receiverId: userId,
                isRead: false,
            },
            data: {
                isRead: true,
            },
        });
    }

    async getUnreadCount(userId: string) {
        const count = await this.prisma.message.count({
            where: {
                receiverId: userId,
                isRead: false,
            },
        });

        return { unreadCount: count };
    }
}
