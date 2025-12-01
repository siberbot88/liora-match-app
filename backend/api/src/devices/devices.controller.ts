import { Controller, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DevicesService } from './devices.service';
import { RegisterDeviceDto } from './dto/register-device.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Devices')
@ApiBearerAuth('JWT-auth')
@Controller('devices')
@UseGuards(JwtAuthGuard)
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register FCM device token' })
  @ApiResponse({ status: 201, description: 'Device token registered' })
  async register(@CurrentUser() user: any, @Body() dto: RegisterDeviceDto) {
    return this.devicesService.register(user.userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete device token' })
  @ApiResponse({ status: 200, description: 'Device token deleted' })
  async delete(@CurrentUser() user: any, @Param('id') deviceId: string) {
    return this.devicesService.delete(user.userId, deviceId);
  }
}
