import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDeviceDto } from './dto/register-device.dto';

@Injectable()
export class DevicesService {
  constructor(private prisma: PrismaService) {}

  async register(userId: string, dto: RegisterDeviceDto) {
    // Check if token already exists
    const existing = await this.prisma.deviceToken.findUnique({
      where: { token: dto.token },
    });

    if (existing) {
      // Update userId if different (user might have logged out and logged in again)
      if (existing.userId !== userId) {
        return this.prisma.deviceToken.update({
          where: { token: dto.token },
          data: {
            userId,
            platform: dto.platform,
          },
        });
      }
      return existing;
    }

    // Create new device token
    return this.prisma.deviceToken.create({
      data: {
        userId,
        token: dto.token,
        platform: dto.platform,
      },
    });
  }

  async delete(userId: string, deviceId: string) {
    const device = await this.prisma.deviceToken.findUnique({
      where: { id: deviceId },
    });

    if (!device) {
      throw new NotFoundException('Device not found');
    }

    if (device.userId !== userId) {
      throw new ForbiddenException('Cannot delete other user device');
    }

    await this.prisma.deviceToken.delete({
      where: { id: deviceId },
    });

    return { message: 'Device deleted successfully' };
  }

  async getUserTokens(userId: string): Promise<string[]> {
    const devices = await this.prisma.deviceToken.findMany({
      where: { userId },
      select: { token: true },
    });

    return devices.map((d) => d.token);
  }

  async removeInvalidToken(token: string) {
    try {
      await this.prisma.deviceToken.delete({
        where: { token },
      });
    } catch (error) {
      // Ignore if already deleted
    }
  }
}
