import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCnhDto } from './dto/create-cnh.dto.js';
import { UpdateCnhDto } from './dto/update-cnh.dto.js';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class CnhService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createCnhDto: CreateCnhDto) {
    await this.findOwnedDocument(userId, createCnhDto.documentId);

    const existingCnh = await this.prisma.cnh.findUnique({
      where: { documentId: createCnhDto.documentId },
    });

    if (existingCnh) {
      throw new ConflictException(
        `Documento com id ${createCnhDto.documentId} já possui uma CNH`,
      );
    }

    return this.prisma.cnh.create({
      data: {
        documentId: createCnhDto.documentId,
        registerNumber: createCnhDto.registerNumber,
        category: createCnhDto.category,
        expirationDate: new Date(createCnhDto.expirationDate),
        issueDate: new Date(createCnhDto.issueDate),
      },
    });
  }

  findAll(userId: number) {
    return this.prisma.cnh.findMany({
      where: { document: { userId } },
    });
  }

  async findOne(userId: number, id: number) {
    const cnh = await this.prisma.cnh.findFirst({
      where: { id, document: { userId } },
    });

    if (!cnh) {
      throw new NotFoundException(`CNH com id ${id} não encontrada`);
    }

    return cnh;
  }

  async update(userId: number, id: number, updateCnhDto: UpdateCnhDto) {
    await this.findOne(userId, id);

    return this.prisma.cnh.update({
      where: { id },
      data: {
        registerNumber: updateCnhDto.registerNumber,
        category: updateCnhDto.category,
        expirationDate: updateCnhDto.expirationDate
          ? new Date(updateCnhDto.expirationDate)
          : undefined,
        issueDate: updateCnhDto.issueDate
          ? new Date(updateCnhDto.issueDate)
          : undefined,
      },
    });
  }

  async remove(userId: number, id: number) {
    await this.findOne(userId, id);

    return this.prisma.cnh.delete({ where: { id } });
  }

  private async findOwnedDocument(userId: number, documentId: number) {
    const document = await this.prisma.document.findFirst({
      where: { id: documentId, userId },
    });

    if (!document) {
      throw new NotFoundException(
        `Documento com id ${documentId} não encontrado`,
      );
    }

    return document;
  }
}
