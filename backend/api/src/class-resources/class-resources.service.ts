import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';

@Injectable()
export class ClassResourcesService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateResourceDto) {
        // Validate class exists
        const classItem = await this.prisma.class.findUnique({
            where: { id: dto.classId },
        });

        if (!classItem) {
            throw new NotFoundException('Class not found');
        }

        const resource = await this.prisma.classResource.create({
            data: dto,
        });

        return resource;
    }

    async findByClass(classId: string) {
        const resources = await this.prisma.classResource.findMany({
            where: { classId },
            orderBy: { order: 'asc' },
        });

        return resources;
    }

    async findOne(id: string) {
        const resource = await this.prisma.classResource.findUnique({
            where: { id },
            include: {
                class: true,
            },
        });

        if (!resource) {
            throw new NotFoundException('Resource not found');
        }

        return resource;
    }

    async update(id: string, dto: UpdateResourceDto) {
        const resource = await this.prisma.classResource.findUnique({
            where: { id },
        });

        if (!resource) {
            throw new NotFoundException('Resource not found');
        }

        const updated = await this.prisma.classResource.update({
            where: { id },
            data: dto,
        });

        return updated;
    }

    async remove(id: string) {
        const resource = await this.prisma.classResource.findUnique({
            where: { id },
        });

        if (!resource) {
            throw new NotFoundException('Resource not found');
        }

        await this.prisma.classResource.delete({
            where: { id },
        });

        return { message: 'Resource deleted successfully' };
    }
}
