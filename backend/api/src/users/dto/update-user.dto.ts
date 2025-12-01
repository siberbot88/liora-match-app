import { IsString, IsOptional, IsUrl } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsUrl()
    @IsOptional()
    avatar?: string;
}
