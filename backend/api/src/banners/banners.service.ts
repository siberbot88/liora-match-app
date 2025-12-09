import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Injectable()
export class BannersService {
    constructor(private prisma: PrismaService) { }

    /**
     * Create a new banner
     */
    async create(createBannerDto: CreateBannerDto) {
        return this.prisma.banner.create({
            data: createBannerDto,
        });
    }

    /**
     * Get all banners (admin view)
     */
    async findAll(filters?: { isActive?: boolean; search?: string }) {
        const where: any = {};

        if (filters?.isActive !== undefined) {
            where.isActive = filters.isActive;
        }

        if (filters?.search) {
            where.OR = [
                { title: { contains: filters.search } },
                { description: { contains: filters.search } },
            ];
        }

        return this.prisma.banner.findMany({
            where,
            orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
        });
    }

    /**
     * Get active banners (for mobile app)
     * Filters: isActive=true, within date range, sorted by priority
     */
    async findActive() {
        const now = new Date();

        return this.prisma.banner.findMany({
            where: {
                isActive: true,
                OR: [
                    // No start date set, or start date in the past
                    { startDate: null },
                    { startDate: { lte: now } },
                ],
                AND: [
                    // No end date set, or end date in the future
                    {
                        OR: [
                            { endDate: null },
                            { endDate: { gte: now } },
                        ],
                    },
                ],
            },
            orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
            take: 10, // Limit to 10 active banners
        });
    }

    /**
     * Get banner by ID
     */
    async findOne(id: string) {
        const banner = await this.prisma.banner.findUnique({
            where: { id },
        });

        if (!banner) {
            throw new NotFoundException(`Banner with ID ${id} not found`);
        }

        return banner;
    }

    /**
     * Update banner
     */
    async update(id: string, updateBannerDto: UpdateBannerDto) {
        await this.findOne(id); // Check if exists

        return this.prisma.banner.update({
            where: { id },
            data: updateBannerDto,
        });
    }

    /**
     * Delete banner
     */
    async remove(id: string) {
        await this.findOne(id); // Check if exists

        return this.prisma.banner.delete({
            where: { id },
        });
    }

    /**
     * Toggle banner active status
     */
    async toggle(id: string) {
        const banner = await this.findOne(id);

        return this.prisma.banner.update({
            where: { id },
            data: { isActive: !banner.isActive },
        });
    }
}
