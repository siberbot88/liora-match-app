import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FilesService {
    private uploadRoot: string;
    private avatarDir: string;
    private materialDir: string;

    constructor(private prisma: PrismaService) {
        this.uploadRoot = process.env.UPLOAD_ROOT || './uploads';
        this.avatarDir = process.env.AVATAR_UPLOAD_DIR || 'avatars';
        this.materialDir = process.env.MATERIAL_UPLOAD_DIR || 'materials';

        this.ensureUploadDirs();
    }

    private ensureUploadDirs() {
        const dirs = [
            this.uploadRoot,
            path.join(this.uploadRoot, this.avatarDir),
            path.join(this.uploadRoot, this.materialDir),
        ];

        dirs.forEach((dir) => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
                console.log(`✅ Created upload directory: ${dir}`);
            }
        });
    }

    /**
     * Build public URL from relative path using APP_URL
     * This is the only way to build file URLs in backend
     * @param relativePath - Relative path (e.g., /uploads/avatars/xxx.jpg)
     * @returns Full public URL
     */
    buildPublicUrl(relativePath: string): string {
        const base = process.env.APP_URL?.replace(/\/$/, '') || 'http://localhost:3000';
        return `${base}${relativePath}`;
    }

    /**
     * Store avatar and return relative URL with updated user
     * @param file - Uploaded file from Multer
     * @param userId - User ID
     * @returns Object with relativeUrl and updatedUser
     */
    async storeAvatar(file: Express.Multer.File, userId: string): Promise<{
        relativeUrl: string;
        updatedUser: {
            id: string;
            name: string | null;
            email: string;
            avatarUrl: string | null;
            role: UserRole;
        };
    }> {
        // Check if user exists
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Delete old avatar if exists
        if (user.avatarUrl) {
            const oldPath = user.avatarUrl.replace('/uploads/', '');
            const fullOldPath = path.join(this.uploadRoot, oldPath);
            if (fs.existsSync(fullOldPath)) {
                try {
                    fs.unlinkSync(fullOldPath);
                    console.log(`🗑️  Deleted old avatar: ${fullOldPath}`);
                } catch (error) {
                    console.error('Failed to delete old avatar:', error);
                }
            }
        }

        // File already saved by Multer diskStorage
        // Build relative URL
        const relativeUrl = `/uploads/${this.avatarDir}/${file.filename}`;

        // Update user in database and get updated data in one query
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: { avatarUrl: relativeUrl },
            select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
                role: true,
            },
        });

        return { relativeUrl, updatedUser };
    }

    /**
     * Get updated user after avatar upload
     * @param userId - User ID
     * @returns User object with full avatar URL
     */
    async getUpdatedUser(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
                role: true,
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return {
            ...user,
            avatarUrl: user.avatarUrl ? this.buildPublicUrl(user.avatarUrl) : null,
        };
    }

    /**
     * Store class material and create ClassMaterial record
     * @param file - Uploaded file
     * @param classId - Class ID
     * @param title - Material title
     * @param teacherId - Teacher user ID (for validation)
     * @returns ClassMaterial object
     */
    async storeMaterial(
        file: Express.Multer.File,
        classId: string,
        title: string,
        teacherUserId: string,
    ) {
        // Verify teacher owns the class
        const user = await this.prisma.user.findUnique({
            where: { id: teacherUserId },
            include: { teacherProfile: true },
        });

        if (!user || user.role !== UserRole.TEACHER || !user.teacherProfile) {
            throw new ForbiddenException('Only teachers can upload materials');
        }

        const classItem = await this.prisma.class.findUnique({
            where: { id: classId },
        });

        if (!classItem) {
            throw new NotFoundException('Class not found');
        }

        if (classItem.teacherProfileId !== user.teacherProfile.id) {
            throw new ForbiddenException('You can only upload materials to your own classes');
        }

        // Determine file type
        let fileType = 'other';
        if (file.mimetype.startsWith('image/')) {
            fileType = 'image';
        } else if (file.mimetype === 'application/pdf') {
            fileType = 'pdf';
        } else if (file.mimetype.includes('word')) {
            fileType = 'document';
        }

        // File already saved by Multer to uploads/materials
        // Build relative URL
        const relativeUrl = `/uploads/${this.materialDir}/${file.filename}`;

        // Create ClassMaterial record
        const material = await this.prisma.classMaterial.create({
            data: {
                classId,
                title,
                fileUrl: relativeUrl,
                mimeType: file.mimetype,
                fileType,
                fileSize: file.size,
            },
        });

        // Return material with full public URL
        return {
            ...material,
            fileUrl: this.buildPublicUrl(material.fileUrl),
        };
    }

    /**
     * Delete material file and database record
     */
    async deleteMaterial(materialId: string, teacherUserId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: teacherUserId },
            include: { teacherProfile: true },
        });

        if (!user || user.role !== UserRole.TEACHER || !user.teacherProfile) {
            throw new ForbiddenException('Only teachers can delete materials');
        }

        const material = await this.prisma.classMaterial.findUnique({
            where: { id: materialId },
            include: { class: true },
        });

        if (!material) {
            throw new NotFoundException('Material not found');
        }

        if (material.class.teacherProfileId !== user.teacherProfile.id) {
            throw new ForbiddenException('You can only delete your own materials');
        }

        // Delete file from disk
        const filePath = material.fileUrl.replace('/uploads/', '');
        const fullPath = path.join(this.uploadRoot, filePath);

        if (fs.existsSync(fullPath)) {
            try {
                fs.unlinkSync(fullPath);
                console.log(`Deleted material file: ${fullPath}`);
            } catch (error) {
                console.error('Failed to delete material file:', error);
            }
        }

        // Delete from database
        await this.prisma.classMaterial.delete({
            where: { id: materialId },
        });

        return { message: 'Material deleted successfully' };
    }
}
