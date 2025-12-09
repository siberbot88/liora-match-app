import { IsString, IsNumber, IsOptional, Min, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RefundTransactionDto {
    @ApiProperty({ description: 'Reason for refund', minLength: 10 })
    @IsString()
    @MinLength(10, { message: 'Refund reason must be at least 10 characters' })
    reason: string;

    @ApiPropertyOptional({ description: 'Refund amount (optional, defaults to full amount)' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    amount?: number;
}
