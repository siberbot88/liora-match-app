import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { FirebaseModule } from './firebase/firebase.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TeachersModule } from './teachers/teachers.module';
import { StudentsModule } from './students/students.module';
import { ClassesModule } from './classes/classes.module';
import { BookingsModule } from './bookings/bookings.module';
import { MessagesModule } from './messages/messages.module';
// Phase 3 modules
import { DevicesModule } from './devices/devices.module';
import { FilesModule } from './files/files.module';
import { PaymentsModule } from './payments/payments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CalendarModule } from './calendar/calendar.module';
import { HealthModule } from './health/health.module';

@Module({
    imports: [
        // Configuration
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),

        // Database
        PrismaModule,

        // Cache & Queue
        RedisModule,

        // Firebase Admin SDK
        FirebaseModule,

        AuthModule,
        UsersModule,
        TeachersModule,
        StudentsModule,
        ClassesModule,
        BookingsModule,
        MessagesModule,

        // Phase 3
        DevicesModule,
        FilesModule,
        PaymentsModule,
        NotificationsModule,
        CalendarModule,
        HealthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
