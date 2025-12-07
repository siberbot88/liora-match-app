import {
    IsString,
    IsNotEmpty,
    IsEnum,
    IsOptional,
    IsInt,
    Min,
    IsUrl,
} from 'class-validator';
import { ResourceType } from '@prisma/client';

export class CreateResourceDto {
    @IsString()
    @IsNotEmpty()
    classId: string;

    @IsEnum(ResourceType)
    @IsNotEmpty()
    type: ResourceType;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsUrl()
    @IsNotEmpty()
    url: string;

    @IsInt()
    @Min(1)
    order: number;
}
