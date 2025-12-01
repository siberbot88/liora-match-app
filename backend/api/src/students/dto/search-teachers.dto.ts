import { IsString, IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ClassMode } from '@prisma/client';

export class SearchTeachersDto {
    @ApiPropertyOptional({ description: 'Subject ID to filter by' })
    @IsString()
    @IsOptional()
    subjectId?: string;

    @ApiPropertyOptional({ description: 'City to filter by' })
    @IsString()
    @IsOptional()
    city?: string;

    @ApiPropertyOptional({ description: 'Province to filter by' })
    @IsString()
    @IsOptional()
    province?: string;

    @ApiPropertyOptional({ description: 'Minimum hourly rate' })
    @IsInt()
    @Min(0)
    @IsOptional()
    priceMin?: number;

    @ApiPropertyOptional({ description: 'Maximum hourly rate' })
    @IsInt()
    @Min(0)
    @IsOptional()
    priceMax?: number;

    @ApiPropertyOptional({ description: 'Minimum rating (0-5)', minimum: 0, maximum: 5 })
    @IsInt()
    @Min(0)
    @Max(5)
    @IsOptional()
    minRating?: number;

    @ApiPropertyOptional({ description: 'Class mode preference', enum: ClassMode })
    @IsEnum(ClassMode)
    @IsOptional()
    mode?: ClassMode;

    @ApiPropertyOptional({ description: 'Search query (name, bio, education)' })
    @IsString()
    @IsOptional()
    search?: string;

    @ApiPropertyOptional({ description: 'Sort by field', enum: ['rating', 'price', 'experience'] })
    @IsString()
    @IsOptional()
    sortBy?: 'rating' | 'price' | 'experience';

    @ApiPropertyOptional({ description: 'Sort order', enum: ['asc', 'desc'] })
    @IsString()
    @IsOptional()
    sortOrder?: 'asc' | 'desc';

    @ApiPropertyOptional({ description: 'Only show verified teachers' })
    @IsOptional()
    verifiedOnly?: boolean;

    @ApiPropertyOptional({ description: 'Page number', default: 1 })
    @IsInt()
    @Min(1)
    @IsOptional()
    page?: number;

    @ApiPropertyOptional({ description: 'Items per page', default: 10 })
    @IsInt()
    @Min(1)
    @Max(50)
    @IsOptional()
    limit?: number;
}
