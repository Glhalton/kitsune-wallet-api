import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto.js';
import { UpdateDocumentDto } from './dto/update-document.dto.js';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createDocumentDto: CreateDocumentDto) {
    const documentType = await this.prisma.documentType.findUnique({
      where: { id: createDocumentDto.typeId },
    });

    if (!documentType) {
      throw new NotFoundException(
        `Tipo de documento com id ${createDocumentDto.typeId} não encontrado`,
      );
    }

    return this.prisma.document.create({
      data: {
        userId,
        typeId: createDocumentDto.typeId,
      },
      include: { documentType: true },
    });
  }

  findAll(userId: number) {
    return this.prisma.document.findMany({
      where: { userId },
      include: { documentType: true },
    });
  }

  async findOne(userId: number, id: number) {
    const document = await this.prisma.document.findFirst({
      where: { id, userId },
      include: {
        documentType: true,
        rgs: true,
        cnhs: true,
        electoralCards: true,
      },
    });

    if (!document) {
      throw new NotFoundException(`Documento com id ${id} não encontrado`);
    }

    return document;
  }

  async update(
    userId: number,
    id: number,
    updateDocumentDto: UpdateDocumentDto,
  ) {
    await this.findOne(userId, id);

    if (updateDocumentDto.typeId) {
      const documentType = await this.prisma.documentType.findUnique({
        where: { id: updateDocumentDto.typeId },
      });

      if (!documentType) {
        throw new NotFoundException(
          `Tipo de documento com id ${updateDocumentDto.typeId} não encontrado`,
        );
      }
    }

    return this.prisma.document.update({
      where: { id },
      data: { typeId: updateDocumentDto.typeId },
      include: { documentType: true },
    });
  }

  async remove(userId: number, id: number) {
    await this.findOne(userId, id);

    return this.prisma.document.delete({
      where: { id },
      include: { documentType: true },
    });
  }
}
