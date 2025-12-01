import { IsString, IsNotEmpty, IsDateString, IsInt, Min, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSessionDto {
    @ApiProperty({ description: 'Session title/topic' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ description: 'Session description' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ description: 'Scheduled date and time', example: '2025-12-05T14:00:00Z' })
    @IsDateString()
    scheduledAt: string;

    @ApiProperty({ description: 'Duration in minutes', example: 60 })
    @IsInt()
    @Min(1)
    duration: number;

    @ApiPropertyOptional({ description: 'Meeting URL for online sessions' })
    @IsString()
    @IsOptional()
    meetingUrl?: string;

    @ApiPropertyOptional({ description: 'Session notes/materials' })
    @IsString()
    @IsOptional()
    notes?: string;
}
