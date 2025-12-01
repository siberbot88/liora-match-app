import { IsString, IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';
import { ClassMode } from '@prisma/client';

export class UpdateClassDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsEnum(ClassMode)
    mode?: ClassMode;

    @IsOptional()
    @IsInt()
    @Min(1)
    maxStudents?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    pricePerSession?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    discountPercent?: number;
}
