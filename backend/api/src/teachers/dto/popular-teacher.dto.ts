import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum PopularityPeriod {
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY',
    ALL_TIME = 'ALL_TIME',
}

export class PopularTeacherDto {
    @ApiProperty()
    @IsString()
    id: string;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    subject: string;

    @ApiProperty()
    @IsNumber()
    rating: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    avatar?: string;

    @ApiProperty()
    @IsNumber()
    totalStudents: number;

    @ApiProperty({ enum: PopularityPeriod })
    @IsEnum(PopularityPeriod)
    period: PopularityPeriod;
}
