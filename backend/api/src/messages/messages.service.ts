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

        messages.forEach((message) => {
            const otherUser = message.senderId === userId ? message.receiver : message.sender;

            if (!conversationsMap.has(otherUser.id)) {
                conversationsMap.set(otherUser.id, {
                    user: otherUser,
                    lastMessage: message,
                });
            }
        });

        return Array.from(conversationsMap.values());
    }
}
