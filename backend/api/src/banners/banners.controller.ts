import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

interface Banner {
    id: string;
    title: string;
    imageUrl: string;
    type: string;
    isActive: boolean;
}

@ApiTags('Banners')
@Controller('banners')
export class BannersController {
    private readonly banners: Banner[] = [
        { id: '1', title: 'Hero Banner 1', imageUrl: '/assets/hero_promotion/hero_1.png', type: 'HERO', isActive: true },
        { id: '2', title: 'Hero Banner 2', imageUrl: '/assets/hero_promotion/hero_2.png', type: 'HERO', isActive: true },
        { id: '3', title: 'Hero Banner 3', imageUrl: '/assets/hero_promotion/hero_3.png', type: 'HERO', isActive: true },
        { id: '4', title: 'Hero Banner 4', imageUrl: '/assets/hero_promotion/hero_4.png', type: 'HERO', isActive: true },
    ];

    @Get()
    @ApiOperation({ summary: 'Get active banners' })
    @ApiResponse({ status: 200, description: 'Banners retrieved' })
    @ApiQuery({ name: 'type', required: false, description: 'Filter by banner type (HERO, PROMO, etc.)' })
    async getBanners(@Query('type') type?: string) {
        if (type) {
            return this.banners.filter(b => b.type === type && b.isActive);
        }
        return this.banners.filter(b => b.isActive);
    }
}
