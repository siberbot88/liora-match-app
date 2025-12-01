import { IsString, IsNotEmpty, IsEnum, IsOptional, IsDateString, IsInt, Min } from 'class-validator';
import { ClassMode } from '@prisma/client';

export class CreateBookingDto {
    @IsString()
    @IsNotEmpty()
    teacherId: string;

    @IsString()
    @IsNotEmpty()
    subjectId: string;

    @IsDateString()
    scheduledAt: string;

    @IsEnum(ClassMode)
    @IsOptional()
    mode?: ClassMode;

    @IsInt()
    @Min(15)
    @IsOptional()
    duration?: number; // In minutes (default: 60)

    @IsString()
    @IsOptional()
    notes?: string;
}
