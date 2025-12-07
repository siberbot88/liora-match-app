import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { ReorderLessonsDto } from './dto/reorder-lessons.dto';

@Injectable()
export class ClassLessonsService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateLessonDto) {
        // Validate section exists
        const section = await this.prisma.classSection.findUnique({
            where: { id: dto.sectionId },
        });

        if (!section) {
            throw new NotFoundException('Section not found');
        }

        const lesson = await this.prisma.classLesson.create({
            data: dto,
        });

        return lesson;
    }

    async findBySection(sectionId: string) {
        const lessons = await this.prisma.classLesson.findMany({
            where: { sectionId },
            orderBy: { order: 'asc' },
        });

        return lessons;
    }

    async findOne(id: string) {
        const lesson = await this.prisma.classLesson.findUnique({
            where: { id },
            include: {
                section: {
                    include: {
                        class: true,
                    },
                },
            },
        });

        if (!lesson) {
            throw new NotFoundException('Lesson not found');
        }

        return lesson;
    }

    async update(id: string, dto: UpdateLessonDto) {
        const lesson = await this.prisma.classLesson.findUnique({
            where: { id },
        });

        if (!lesson) {
            throw new NotFoundException('Lesson not found');
        }

        const updated = await this.prisma.classLesson.update({
            where: { id },
            data: dto,
        });

        return updated;
    }

    async remove(id: string) {
        const lesson = await this.prisma.classLesson.findUnique({
            where: { id },
        });

        if (!lesson) {
            throw new NotFoundException('Lesson not found');
        }

        await this.prisma.classLesson.delete({
            where: { id },
        });

        return { message: 'Lesson deleted successfully' };
    }

    async reorder(sectionId: string, dto: ReorderLessonsDto) {
        // Update order for all lessons in a transaction
        await this.prisma.$transaction(
            dto.lessonIds.map((lessonId, index) =>
                this.prisma.classLesson.update({
                    where: { id: lessonId },
                    data: { order: index + 1 },
                }),
            ),
        );

        return { message: 'Lessons reordered successfully' };
    }
}
