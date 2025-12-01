import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ClassMode } from '@prisma/client';

export class QueryTeachersDto {
    @IsString()
    @IsOptional()
    subjectId?: string;

    @IsString()
    @IsOptional()
    city?: string;

    @IsEnum(ClassMode)
    @IsOptional()
    mode?: ClassMode;

    @Type(() => Number)
    @IsInt()
    @Min(0)
    @IsOptional()
    priceMin?: number;

    @Type(() => Number)
    @IsInt()
    @Min(0)
    @IsOptional()
    priceMax?: number;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    page?: number = 1;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    limit?: number = 10;
}
