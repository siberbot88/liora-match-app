import { IsString, IsNotEmpty, IsEnum, IsInt, Min, Max, IsOptional } from 'class-validator';
import { ClassMode } from '@prisma/client';

export class CreateClassDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsNotEmpty()
    subjectId: string;

    @IsEnum(ClassMode)
    mode: ClassMode;

    @IsString()
    @IsOptional()
    location?: string;

    @IsInt()
    @Min(1)
    @Max(100)
    maxStudents: number;

    @IsString()
    @IsNotEmpty()
    schedule: string; // e.g., "Mon, Wed 14:00-16:00"
}
