import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PopularClassDto {
    @ApiProperty()
    @IsString()
    id: string;

    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsString()
    subject: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    thumbnail?: string;

    @ApiProperty()
    @IsNumber()
    enrollmentCount: number;

    @ApiProperty()
    @IsNumber()
    rating: number;
}
