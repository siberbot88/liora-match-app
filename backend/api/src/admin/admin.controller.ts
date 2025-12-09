import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('dashboard/stats')
    @ApiOperation({ summary: 'Get dashboard statistics' })
    async getDashboardStats() {
        return this.adminService.getDashboardStats();
    }

    @Get('dashboard/activity-recent')
    @ApiOperation({ summary: 'Get recent activity logs' })
    async getRecentActivities(
        @Query('limit') limit?: string,
    ) {
        const limitNumber = limit ? parseInt(limit, 10) : 50;
        return this.adminService.getRecentActivities(limitNumber);
    }
}
