import {
    Controller,
    Get,
    Post,
    Param,
    Query,
    Body,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { QueryTransactionsDto } from './dto/query-transactions.dto';
import { RefundTransactionDto } from './dto/refund-transaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Transactions (Admin)')
@Controller('admin/transactions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth('JWT-auth')
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) { }

    @Get()
    @ApiOperation({ summary: 'List all transactions with filters (Admin)' })
    @ApiResponse({ status: 200, description: 'Transactions retrieved successfully' })
    async findAll(@Query() query: QueryTransactionsDto) {
        return this.transactionsService.findAll(query);
    }

    @Get('stats')
    @ApiOperation({ summary: 'Get transaction statistics (Admin)' })
    @ApiQuery({ name: 'period', required: false, enum: ['today', 'week', 'month', 'year'] })
    @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
    async getStats(@Query('period') period?: string) {
        return this.transactionsService.getStats(period);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get transaction details (Admin)' })
    @ApiResponse({ status: 200, description: 'Transaction details retrieved' })
    @ApiResponse({ status: 404, description: 'Transaction not found' })
    async findOne(@Param('id') id: string) {
        return this.transactionsService.findOne(id);
    }

    @Post(':id/refund')
    @ApiOperation({ summary: 'Process transaction refund (Admin)' })
    @ApiResponse({ status: 200, description: 'Refund processed successfully' })
    @ApiResponse({ status: 400, description: 'Invalid refund request' })
    @ApiResponse({ status: 404, description: 'Transaction not found' })
    async processRefund(
        @Param('id') id: string,
        @Body() dto: RefundTransactionDto,
        @CurrentUser() user: any,
    ) {
        return this.transactionsService.processRefund(id, dto, user.userId);
    }
}
