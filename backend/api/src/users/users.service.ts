import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findOne(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                avatar: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
                studentProfile: {
                    select: {
                        id: true,
                        grade: true,
                        school: true,
                        address: true,
                        parentName: true,
                        parentPhone: true,
                        learningGoals: true,
                    },
                },
                teacherProfile: {
                    select: {
                        id: true,
                        bio: true,
                        education: true,
                        experience: true,
                        hourlyRate: true,
                        rating: true,
                        totalReviews: true,
                        isVerified: true,
                        city: true,
                        province: true,
                    },
                },
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async update(userId: string, dto: UpdateUserDto) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                name: dto.name,
                phone: dto.phone,
                avatar: dto.avatar,
            },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                avatar: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
                studentProfile: true,
                teacherProfile: true,
            },
        });

        return user;
    }
}
