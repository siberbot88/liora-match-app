import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { Request } from 'express';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post('booking/:bookingId')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Create payment for booking (Student only)' })
    @ApiResponse({ status: 201, description: 'Payment created, returns Snap token' })
    async createPayment(
        @CurrentUser() user: any,
        @Param('bookingId') bookingId: string,
    ) {
        return this.paymentsService.createPayment(user.userId, bookingId);
    }

    @Post('webhook')
    @ApiOperation({ summary: 'Midtrans webhook notification' })
    @ApiResponse({ status: 200, description: 'Webhook processed' })
    async handleWebhook(@Body() body: any, @Req() req: Request) {
        return this.paymentsService.handleWebhook(body);
    }

    @Get('transaction/:transactionId')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get transaction status' })
    @ApiResponse({ status: 200, description: 'Transaction status retrieved' })
    async getTransaction(
        @CurrentUser() user: any,
        @Param('transactionId') transactionId: string,
    ) {
        return this.paymentsService.getTransaction(user.userId, transactionId);
    }

    @Get('my-transactions')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get my payment transactions' })
    @ApiResponse({ status: 200, description: 'Transactions list retrieved' })
    async getMyTransactions(@CurrentUser() user: any) {
        return this.paymentsService.getMyTransactions(user.userId);
    }
}
