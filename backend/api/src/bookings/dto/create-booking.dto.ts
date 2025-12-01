import { IsString, IsNotEmpty, IsEnum, IsOptional, IsDateString } from 'class-validator';
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

    @IsString()
    @IsOptional()
    notes?: string;
}
