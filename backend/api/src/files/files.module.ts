import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { PrismaModule } from '../prisma/prisma.module';
import { extname } from 'path';

// Helper function untuk generate filename yang aman
function generateFilename(req: any, file: Express.Multer.File, cb: any) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const ext = extname(file.originalname);
    const slugifiedName = file.originalname
        .replace(ext, '')
        .replace(/[^a-zA-Z0-9]/g, '-')
        .substring(0, 30);

    cb(null, `${timestamp}-${random}-${slugifiedName}${ext}`);
}

// Factory untuk create multer options
export function createMulterOptions(subfolder: 'avatars' | 'materials') {
    const uploadRoot = process.env.UPLOAD_ROOT || './uploads';
    const maxSizeMB = parseInt(process.env.MAX_UPLOAD_SIZE_MB || '10');

    return {
        storage: diskStorage({
            destination: (req, file, cb) => {
                const dest = `${uploadRoot}/${subfolder}`;
                cb(null, dest);
            },
            filename: generateFilename,
        }),
        limits: {
            fileSize: maxSizeMB * 1024 * 1024, // Convert MB to bytes
        },
        fileFilter: (req: any, file: Express.Multer.File, cb: any) => {
            if (subfolder === 'avatars') {
                // Only allow images for avatars
                const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
                if (allowedMimes.includes(file.mimetype)) {
                    cb(null, true);
                } else {
                    cb(new Error('Only image files (JPEG, PNG, WEBP) are allowed for avatars'), false);
                }
            } else if (subfolder === 'materials') {
                // Allow PDF, images, and documents for materials
                const allowedMimes = [
                    'application/pdf',
                    'image/jpeg',
                    'image/png',
                    'image/jpg',
                    'image/webp',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                ];
                if (allowedMimes.includes(file.mimetype)) {
                    cb(null, true);
                } else {
                    cb(new Error('Only PDF, images, and Word documents are allowed for materials'), false);
                }
            }
        },
    };
}

@Module({
    imports: [
        PrismaModule,
        MulterModule.register({
            limits: {
                fileSize: parseInt(process.env.MAX_UPLOAD_SIZE_MB || '10') * 1024 * 1024,
            },
        }),
    ],
    controllers: [FilesController],
    providers: [FilesService],
})
export class FilesModule { }
