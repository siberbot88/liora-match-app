import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Notifications')
@ApiBearerAuth('JWT-auth')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Get('my')
    @ApiOperation({ summary: 'Get my notifications' })
    @ApiResponse({ status: 200, description: 'Notifications retrieved' })
    async getMyNotifications(@CurrentUser() user: any) {
        return this.notificationsService.getMyNotifications(user.userId);
    }

    @Get('unread-count')
    @ApiOperation({ summary: 'Get unread notifications count' })
    @ApiResponse({ status: 200, description: 'Unread count retrieved' })
    async getUnreadCount(@CurrentUser() user: any) {
        return this.notificationsService.getUnreadCount(user.userId);
    }

    @Patch(':id/read')
    @ApiOperation({ summary: 'Mark notification as read' })
    @ApiResponse({ status: 200, description: 'Notification marked as read' })
    async markAsRead(
        @CurrentUser() user: any,
        @Param('id') notificationId: string,
    ) {
        return this.notificationsService.markAsRead(user.userId, notificationId);
    }

    @Patch('mark-all-read')
    @ApiOperation({ summary: 'Mark all notifications as read' })
    @ApiResponse({ status: 200, description: 'All notifications marked as read' })
    async markAllAsRead(@CurrentUser() user: any) {
        return this.notificationsService.markAllAsRead(user.userId);
    }
}
