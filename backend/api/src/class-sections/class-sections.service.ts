import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { ReorderSectionsDto } from './dto/reorder-sections.dto';
import { TeachingType } from '@prisma/client';

@Injectable()
export class ClassSectionsService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateSectionDto) {
        // Validate class exists and is ONLINE_COURSE
        const classItem = await this.prisma.class.findUnique({
            where: { id: dto.classId },
        });

        if (!classItem) {
            throw new NotFoundException('Class not found');
        }

        if (classItem.teachingType !== TeachingType.ONLINE_COURSE) {
            throw new BadRequestException(
                'Sections can only be created for ONLINE_COURSE teaching type',
            );
        }

        const section = await this.prisma.classSection.create({
            data: dto,
            include: {
                lessons: true,
            },
        });

        return section;
    }

    async findByClass(classId: string) {
        const sections = await this.prisma.classSection.findMany({
            where: { classId },
            include: {
                lessons: {
                    orderBy: { order: 'asc' },
                },
            },
            orderBy: { order: 'asc' },
        });

        return sections;
    }

    async findOne(id: string) {
        const section = await this.prisma.classSection.findUnique({
            where: { id },
            include: {
                class: true,
                lessons: {
                    orderBy: { order: 'asc' },
                },
            },
        });

        if (!section) {
            throw new NotFoundException('Section not found');
        }

        return section;
    }

    async update(id: string, dto: UpdateSectionDto) {
        const section = await this.prisma.classSection.findUnique({
            where: { id },
        });

        if (!section) {
            throw new NotFoundException('Section not found');
        }

        const updated = await this.prisma.classSection.update({
            where: { id },
            data: dto,
            include: {
                lessons: true,
            },
        });

        return updated;
    }

    async remove(id: string) {
        const section = await this.prisma.classSection.findUnique({
            where: { id },
        });

        if (!section) {
            throw new NotFoundException('Section not found');
        }

        // Cascade delete lessons automatically
        await this.prisma.classSection.delete({
            where: { id },
        });

        return { message: 'Section deleted successfully' };
    }

    async reorder(classId: string, dto: ReorderSectionsDto) {
        // Update order for all sections in a transaction
        await this.prisma.$transaction(
            dto.sectionIds.map((sectionId, index) =>
                this.prisma.classSection.update({
                    where: { id: sectionId },
                    data: { order: index + 1 },
                }),
            ),
        );

        return { message: 'Sections reordered successfully' };
    }
}
