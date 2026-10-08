import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRgDto } from './dto/create-rg.dto.js';
import { UpdateRgDto } from './dto/update-rg.dto.js';
import { PrismaService } from '../../database/prisma.service.js';
import { DocumentsService } from '../documents/documents.service.js';

@Injectable()
export class RgService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createRgDto: CreateRgDto) {
    const documentType = await this.prisma.documentType.findUnique({
      where: { name: 'RG' },
    });

    if (!documentType) {
      throw new NotFoundException('Tipo de documento RG não encontrado');
    }

    const existingRg = await this.prisma.rg.findFirst({
      where: {
        document: {
          userId,
        },
        cpf: createRgDto.cpf,
      },
    });

    if (existingRg) {
      throw new ConflictException(
        `Já existe um RG cadastrado para o CPF ${createRgDto.cpf}`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const document = await tx.document.create({
        data: {
          userId,
          typeId: documentType.id,
        },
      });

      const rg = await tx.rg.create({
        data: {
          documentId: document.id,
          issuingAuthority: createRgDto.issuingAuthority,
          registerNumber: createRgDto.registerNumber,
          cpf: createRgDto.cpf,
          militaryCertification: createRgDto.militaryCertification,
          uf: createRgDto.uf,
          issueDate: new Date(createRgDto.issueDate),
        },
      });

      return {
        document,
        rg,
      };
    });
  }

  findAll(userId: number) {
    return this.prisma.rg.findMany({
      where: { document: { userId } },
    });
  }

  async findOne(userId: number, documentId: number) {
    const rg = await this.prisma.rg.findFirst({
      where: {
        documentId,
        document: {
          userId,
        },
      },
    });

    if (!rg) {
      throw new NotFoundException(
        `RG do documento ${documentId} não encontrado`,
      );
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
