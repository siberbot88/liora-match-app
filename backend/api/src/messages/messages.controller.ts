import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
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
    @ApiOperation({ summary: 'Get my conversations' })
    @ApiResponse({ status: 200, description: 'Conversations list' })
    async getConversations(@CurrentUser() user: any) {
        return this.messagesService.getMyConversations(user.userId);
    }

    @Get(':otherUserId')
    @ApiOperation({ summary: 'Get message history with user' })
    @ApiResponse({ status: 200, description: 'Message history retrieved' })
    async getMessageHistory(
        @CurrentUser() user: any,
        @Param('otherUserId') otherUserId: string,
    ) {
        return this.messagesService.getMessageHistory(user.userId, otherUserId);
    }

    @Post()
    @ApiOperation({ summary: 'Send message (HTTP fallback)' })
    @ApiResponse({ status: 201, description: 'Message sent successfully' })
    async sendMessage(@CurrentUser() user: any, @Body() dto: SendMessageDto) {
        return this.messagesService.sendMessage(user.userId, dto);
    }
}
