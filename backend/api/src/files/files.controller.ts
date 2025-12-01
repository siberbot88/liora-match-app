import {
    Controller,
    Post,
    Delete,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    Param,
    Body,
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { createMulterOptions } from './files.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthUser } from '../auth/interfaces';
import { UserRole } from '@prisma/client';

@ApiTags('Files')
@ApiBearerAuth('JWT-auth')
@Controller('files')
@UseGuards(JwtAuthGuard) // JWT authentication required for all endpoints
export class FilesController {
    constructor(private readonly filesService: FilesService) { }

    @Post('avatar')
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Upload user avatar (JWT required)' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiResponse({ status: 201, description: 'Avatar uploaded successfully' })
    @ApiResponse({ status: 400, description: 'Bad request - invalid file type or size' })
    @UseInterceptors(FileInterceptor('file', createMulterOptions('avatars')))
    async uploadAvatar(
        @CurrentUser() user: AuthUser,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        // Service returns both relative URL and updated user
        const { relativeUrl, updatedUser } = await this.filesService.storeAvatar(file, user.userId);

        // Build public URL
        const publicUrl = this.filesService.buildPublicUrl(relativeUrl);

        return {
            message: 'Avatar uploaded successfully',
            avatarUrl: publicUrl,
            user: {
                ...updatedUser,
                avatarUrl: publicUrl, // Override with public URL
            },
        };
    }

    @Post('classes/:classId/materials')
    @UseGuards(JwtAuthGuard, RolesGuard) // JWT + Role guards combined
    @Roles(UserRole.TEACHER)
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Upload class material (Teachers only)' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
                title: {
                    type: 'string',
                    description: 'Material title',
                },
            },
            required: ['file', 'title'],
        },
    })
    @ApiResponse({ status: 201, description: 'Material uploaded successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden - not class owner' })
    @UseInterceptors(FileInterceptor('file', createMulterOptions('materials')))
    async uploadMaterial(
        @CurrentUser() user: AuthUser,
        @Param('classId') classId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body('title') title: string,
    ) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        if (!title) {
            throw new BadRequestException('Title is required');
        }

        // Service already returns material with full public URL
        const material = await this.filesService.storeMaterial(
            file,
            classId,
            title,
            user.userId,
        );

        return material;
    }

    @Delete('materials/:materialId')
    @UseGuards(JwtAuthGuard, RolesGuard) // JWT + Role guards combined
    @Roles(UserRole.TEACHER)
    @ApiOperation({ summary: 'Delete class material (Teachers only)' })
    @ApiResponse({ status: 200, description: 'Material deleted successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden - not material owner' })
    async deleteMaterial(
        @CurrentUser() user: AuthUser,
        @Param('materialId') materialId: string,
    ) {
        return this.filesService.deleteMaterial(materialId, user.userId);
    }
}
