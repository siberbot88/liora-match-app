import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '@prisma/client';

export class FirebaseLoginDto {
    @IsString()
    @IsNotEmpty()
    firebaseToken: string;

    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;
}
