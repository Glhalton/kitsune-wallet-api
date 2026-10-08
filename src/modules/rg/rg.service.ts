import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRgDto } from './dto/create-rg.dto.js';
import { UpdateRgDto } from './dto/update-rg.dto.js';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class RgService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createRgDto: CreateRgDto) {
    await this.findOwnedDocument(userId, createRgDto.documentId);

    const existingRg = await this.prisma.rg.findUnique({
      where: { documentId: createRgDto.documentId },
    });

    if (existingRg) {
      throw new ConflictException(
        `Documento com id ${createRgDto.documentId} já possui um RG`,
      );
    }

    return this.prisma.rg.create({
      data: {
        documentId: createRgDto.documentId,
        issuingAuthority: createRgDto.issuingAuthority,
        registerNumber: createRgDto.registerNumber,
        cpf: createRgDto.cpf,
        militaryCertification: createRgDto.militaryCertification,
        uf: createRgDto.uf,
        issueDate: new Date(createRgDto.issueDate),
      },
    });
  }

  findAll(userId: number) {
    return this.prisma.rg.findMany({
      where: { document: { userId } },
    });
  }

  async findOne(userId: number, id: number) {
    const rg = await this.prisma.rg.findFirst({
      where: { id, document: { userId } },
    });

    if (!rg) {
      throw new NotFoundException(`RG com id ${id} não encontrado`);
    }

    return rg;
  }

  async update(userId: number, id: number, updateRgDto: UpdateRgDto) {
    await this.findOne(userId, id);

    return this.prisma.rg.update({
      where: { id },
      data: {
        issuingAuthority: updateRgDto.issuingAuthority,
        registerNumber: updateRgDto.registerNumber,
        cpf: updateRgDto.cpf,
        militaryCertification: updateRgDto.militaryCertification,
        uf: updateRgDto.uf,
        issueDate: updateRgDto.issueDate
          ? new Date(updateRgDto.issueDate)
          : undefined,
      },
    });
  }

  async remove(userId: number, id: number) {
    await this.findOne(userId, id);

    return this.prisma.rg.delete({ where: { id } });
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
