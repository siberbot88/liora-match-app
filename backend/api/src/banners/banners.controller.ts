import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
} from '@nestjs/common';
import { BannersService } from './banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('banners')
@Controller('banners')
export class BannersController {
    constructor(private readonly bannersService: BannersService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create new banner (Admin only)' })
    @ApiResponse({ status: 201, description: 'Banner created successfully' })
    create(@Body() createBannerDto: CreateBannerDto) {
        return this.bannersService.create(createBannerDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all banners (Admin view)' })
    @ApiQuery({ name: 'isActive', required: false, type: Boolean })
    @ApiQuery({ name: 'search', required: false, type: String })
    @ApiResponse({ status: 200, description: 'List of all banners' })
    findAll(
        @Query('isActive') isActive?: string,
        @Query('search') search?: string,
    ) {
        const filters: any = {};

        if (isActive !== undefined) {
            filters.isActive = isActive === 'true';
        }

        if (search) {
            filters.search = search;
        }

        return this.bannersService.findAll(filters);
    }

    @Get('active')
    @ApiOperation({ summary: 'Get active banners (Public - for mobile app)' })
    @ApiResponse({ status: 200, description: 'List of active banners' })
    findActive() {
        return this.bannersService.findActive();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get banner details' })
    @ApiResponse({ status: 200, description: 'Banner details' })
    @ApiResponse({ status: 404, description: 'Banner not found' })
    findOne(@Param('id') id: string) {
        return this.bannersService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update banner' })
    @ApiResponse({ status: 200, description: 'Banner updated successfully' })
    @ApiResponse({ status: 404, description: 'Banner not found' })
    update(@Param('id') id: string, @Body() updateBannerDto: UpdateBannerDto) {
        return this.bannersService.update(id, updateBannerDto);
    }

    @Patch(':id/toggle')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Toggle banner active status' })
    @ApiResponse({ status: 200, description: 'Banner status toggled successfully' })
    @ApiResponse({ status: 404, description: 'Banner not found' })
    toggle(@Param('id') id: string) {
        return this.bannersService.toggle(id);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete banner' })
    @ApiResponse({ status: 200, description: 'Banner deleted successfully' })
    @ApiResponse({ status: 404, description: 'Banner not found' })
    remove(@Param('id') id: string) {
        return this.bannersService.remove(id);
    }
}
