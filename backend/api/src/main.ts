import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // Set global prefix for all routes
    app.setGlobalPrefix('api');

    // Enable CORS for mobile & web development
    app.enableCors({
        origin: [
            'http://localhost:3001',           // Website (Next.js)
            'http://localhost:19006',          // Expo web
            'http://192.168.43.237:3001',      // Website on local network
            'http://192.168.43.237:19006',     // Expo on local network
            /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:\d+$/, // Any local IP
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // Global validation pipe with transformation
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,           // Strip non-decorated properties
            forbidNonWhitelisted: true, // Throw error if non-whitelisted properties exist
            transform: true,            // Auto-transform payloads to DTO instances
            transformOptions: {
                enableImplicitConversion: true, // Auto-convert types
            },
        }),
    );

    // Cookie parser middleware
    app.use(cookieParser());

    // Swagger API Documentation
    const config = new DocumentBuilder()
        .setTitle('Liora API')
        .setDescription('Liora Platform - Teacher & Student Learning Management API')
        .setVersion('1.0')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'Enter JWT token',
                in: 'header',
            },
            'JWT-auth',
        )
        .addTag('Authentication', 'Firebase authentication and JWT token management')
        .addTag('Users', 'User profile management')
        .addTag('Teachers', 'Teacher profiles, subjects, and availability')
        .addTag('Students', 'Student profiles and enrollments')
        .addTag('Classes', 'Class management and enrollment')
        .addTag('Bookings', 'Private lesson bookings')
        .addTag('Messages', 'Real-time messaging')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const port = configService.get('PORT') || 3000;
    await app.listen(port);

    console.log(`🚀 Liora Backend API running on: http://localhost:${port}/api`);
    console.log(`📚 Swagger Docs available at: http://localhost:${port}/api/docs`);
}

bootstrap();
