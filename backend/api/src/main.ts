import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // Global prefix
    app.setGlobalPrefix('api');

    // Serve static files from uploads folder
    const uploadRoot = process.env.UPLOAD_ROOT || './uploads';
    app.useStaticAssets(join(__dirname, '..', '..', uploadRoot), {
        prefix: '/uploads',
    });

    // CORS
    app.enableCors({
        origin: '*',
        credentials: true,
    });

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        }),
    );

    // Global interceptors and filters
    app.useGlobalInterceptors(new LoggingInterceptor());
    app.useGlobalFilters(new GlobalExceptionFilter());

    // Swagger documentation
    const config = new DocumentBuilder()
        .setTitle('Liora API')
        .setDescription('Platform Belajar Guru & Murid - Complete Backend API with Phase 3')
        .setVersion('1.0')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
            'JWT-auth',
        )
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const port = process.env.PORT || 3333;
    await app.listen(port, '0.0.0.0');

    console.log('🚀 Liora Backend API (Phase 3)');
    console.log(`📡 Server: http://0.0.0.0:${port}/api`);
    console.log(`📡 Network: http://192.168.100.1:${port}/api`);
    console.log(`📚 Swagger: http://localhost:${port}/api/docs`);
    console.log(`💬 WebSocket: ws://localhost:${port}/messages`);
    console.log(`📁 Static files: http://localhost:${port}/uploads/`);
    console.log(`🏥 Health check: http://localhost:${port}/health`);
}

bootstrap();
