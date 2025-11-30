import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS
    app.enableCors({
        origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:19006', 'http://localhost:3001'],
        credentials: true,
    });

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        }),
    );

    // Cookie parser
    app.use(cookieParser());

    // Global prefix
    app.setGlobalPrefix('api');

    const port = process.env.PORT || 3000;
    await app.listen(port);

    console.log(`🚀 Liora Backend API running on: http://localhost:${port}/api`);
}

bootstrap();
