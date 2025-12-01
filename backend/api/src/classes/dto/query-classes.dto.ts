import { IsOptional, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ClassMode } from '@prisma/client';

export class QueryClassesDto {
    @IsString()
    @IsOptional()
    subjectId?: string;

    @IsEnum(ClassMode)
    @IsOptional()
    mode?: ClassMode;

    @IsString()
    @IsOptional()
    search?: string;

    @Type(() => Number)
    @IsOptional()
    page?: number = 1;

    @Type(() => Number)
    @IsOptional()
    limit?: number = 10;
}
