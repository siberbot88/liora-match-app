import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { FirebaseModule } from '../firebase/firebase.module';
import { DevicesModule } from '../devices/devices.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [FirebaseModule, DevicesModule, PrismaModule],
    controllers: [NotificationsController],
    providers: [NotificationsService],
    exports: [NotificationsService],
})
export class NotificationsModule { }
