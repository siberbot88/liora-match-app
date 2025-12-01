import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDeviceDto {
  @ApiProperty({ description: 'FCM device token' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ description: 'Platform', enum: ['ios', 'android', 'web'] })
  @IsString()
  @IsIn(['ios', 'android', 'web'])
  platform: string;
}
