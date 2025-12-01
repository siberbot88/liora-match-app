import { IsString, IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ClassMode } from '@prisma/client';

export class SearchClassesDto {
    @ApiPropertyOptional({ description: 'Subject ID to filter by' })
    @IsString()
    @IsOptional()
    subjectId?: string;

    @ApiPropertyOptional({ description: 'Class mode', enum: ClassMode })
    @IsEnum(ClassMode)
    @IsOptional()
    mode?: ClassMode;

    @ApiPropertyOptional({ description: 'Minimum price per session' })
    @IsInt()
    @Min(0)
    @IsOptional()
    priceMin?: number;

    @ApiPropertyOptional({ description: 'Maximum price per session' })
    @IsInt()
    @Min(0)
    @IsOptional()
    priceMax?: number;

    @ApiPropertyOptional({ description: 'Search query (title, description)' })
    @IsString()
    @IsOptional()
    search?: string;

    @ApiPropertyOptional({ description: 'Only show classes with available slots' })
    @IsOptional()
    availableOnly?: boolean;

    @ApiPropertyOptional({ description: 'Sort by field', enum: ['price', 'popularity', 'rating'] })
    @IsString()
    @IsOptional()
    sortBy?: 'price' | 'popularity' | 'rating';

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
