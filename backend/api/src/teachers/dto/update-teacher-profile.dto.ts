import { IsString, IsOptional, IsInt, Min, IsUrl } from 'class-validator';

export class UpdateTeacherProfileDto {
    @IsString()
    @IsOptional()
    bio?: string;

    @IsString()
    @IsOptional()
    education?: string;

    @IsInt()
    @Min(0)
    @IsOptional()
    experience?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    hourlyRate?: number;

    @IsString()
    @IsOptional()
    address?: string;

    @IsString()
    @IsOptional()
    city?: string;

    @IsString()
    @IsOptional()
    province?: string;
}
