import { IsOptional, IsString, IsEnum, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { Jenjang, TeachingType } from '@prisma/client';

export class QueryClassesDto {
    // Pagination
    @Type(() => Number)
    @IsOptional()
    page?: number = 1;

    @Type(() => Number)
    @IsOptional()
    limit?: number = 10;

    // Search & Filters
    @IsString()
    @IsOptional()
    search?: string;

    @IsEnum(Jenjang)
    @IsOptional()
    jenjang?: Jenjang;

    @IsEnum(TeachingType)
    @IsOptional()
    teachingType?: TeachingType;

    @IsString()
    @IsOptional()
    teacherProfileId?: string;

    @IsString()
    @IsOptional()
    subject?: string;

    @Type(() => Boolean)
    @IsBoolean()
    @IsOptional()
    isPublished?: boolean;
}
