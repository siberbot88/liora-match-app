import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class AddSubjectDto {
    @IsString()
    @IsNotEmpty()
    subjectId: string;

    @IsBoolean()
    @IsOptional()
    isPrimary?: boolean = false;
}
