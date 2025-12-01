import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Messages')
@ApiBearerAuth('JWT-auth')
@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) { }

    @Get('conversations')
    @ApiOperation({ summary: 'Get my conversations with unread count' })
    @ApiResponse({ status: 200, description: 'Conversations list with unread count' })
    async getConversations(@CurrentUser() user: any) {
        return this.messagesService.getMyConversations(user.userId);
    }

    @Get('unread-count')
    @ApiOperation({ summary: 'Get total unread messages count' })
    @ApiResponse({ status: 200, description: 'Unread count retrieved' })
    async getUnreadCount(@CurrentUser() user: any) {
        return this.messagesService.getUnreadCount(user.userId);
    }

    @Get(':otherUserId')
    @ApiOperation({ summary: 'Get message history with user (auto marks as read)' })
    @ApiResponse({ status: 200, description: 'Message history retrieved' })
    async getMessageHistory(
        @CurrentUser() user: any,
        @Param('otherUserId') otherUserId: string,
    ) {
        return this.messagesService.getMessageHistory(user.userId, otherUserId);
    }

    @Post()
    @ApiOperation({ summary: 'Send message (HTTP fallback for WebSocket)' })
    @ApiResponse({ status: 201, description: 'Message sent successfully' })
    async sendMessage(@CurrentUser() user: any, @Body() dto: SendMessageDto) {
        return this.messagesService.sendMessage(user.userId, dto);
    }

    @Patch(':otherUserId/mark-read')
    @ApiOperation({ summary: 'Mark all messages from user as read' })
    @ApiResponse({ status: 200, description: 'Messages marked as read' })
    async markAsRead(
        @CurrentUser() user: any,
        @Param('otherUserId') otherUserId: string,
    ) {
        await this.messagesService.markMessagesAsRead(user.userId, otherUserId);
        return { message: 'Messages marked as read' };
    }
}
