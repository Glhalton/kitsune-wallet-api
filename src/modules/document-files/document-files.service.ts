import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentFileDto } from './dto/create-document-file.dto.js';
import { UpdateDocumentFileDto } from './dto/update-document-file.dto.js';
import { PrismaService } from '../../database/prisma.service.js';

type DocumentFileRecord = { size: bigint };

@Injectable()
export class DocumentFilesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createDocumentFileDto: CreateDocumentFileDto) {
    await this.findOwnedDocument(userId, createDocumentFileDto.documentId);

    const file = await this.prisma.documentFile.create({
      data: {
        documentId: createDocumentFileDto.documentId,
        storageKey: createDocumentFileDto.storageKey,
        mimeType: createDocumentFileDto.mimeType,
        size: createDocumentFileDto.size,
      },
    });

    return this.toResponse(file);
  }

  async findAll(userId: number) {
    const files = await this.prisma.documentFile.findMany({
      where: { document: { userId } },
    });

    return files.map((file) => this.toResponse(file));
  }

  async findOne(userId: number, id: number) {
    const file = await this.prisma.documentFile.findFirst({
      where: { id, document: { userId } },
    });

    if (!file) {
      throw new NotFoundException(`Arquivo com id ${id} não encontrado`);
    }

    return this.toResponse(file);
  }

  async update(
    userId: number,
    id: number,
    updateDocumentFileDto: UpdateDocumentFileDto,
  ) {
    await this.findOne(userId, id);

    const file = await this.prisma.documentFile.update({
      where: { id },
      data: {
        storageKey: updateDocumentFileDto.storageKey,
        mimeType: updateDocumentFileDto.mimeType,
        size: updateDocumentFileDto.size,
      },
    });

    return this.toResponse(file);
  }

  async remove(userId: number, id: number) {
    await this.findOne(userId, id);

    const file = await this.prisma.documentFile.delete({ where: { id } });

    return this.toResponse(file);
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

  /** BigInt não é serializável em JSON, então o tamanho sai como number. */
  private toResponse<T extends DocumentFileRecord>(file: T) {
    return { ...file, size: Number(file.size) };
  }
}
