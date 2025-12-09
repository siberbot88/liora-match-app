import { IsOptional, IsString, IsEnum, IsDateString, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentStatus } from '@prisma/client';

export class QueryTransactionsDto {
    @ApiPropertyOptional({ enum: PaymentStatus })
    @IsOptional()
    @IsEnum(PaymentStatus)
    status?: PaymentStatus;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    studentId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    teacherId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    dateFrom?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    dateTo?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ default: 1 })
    @IsOptional()
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ default: 10 })
    @IsOptional()
    @IsNumber()
    @Min(1)
    limit?: number = 10;
}
