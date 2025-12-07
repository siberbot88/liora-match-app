import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateSectionDto {
    @IsString()
    @IsNotEmpty()
    classId: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsInt()
    @Min(1)
    order: number;
}
