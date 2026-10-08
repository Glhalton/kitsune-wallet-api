import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto.js';
import { UpdateDocumentTypeDto } from './dto/update-document-type.dto.js';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class DocumentTypesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDocumentTypeDto: CreateDocumentTypeDto) {
    const existingType = await this.prisma.documentType.findUnique({
      where: { name: createDocumentTypeDto.name },
    });

    if (existingType) {
      throw new ConflictException(
        `Tipo de documento ${createDocumentTypeDto.name} já existe`,
      );
    }

    return this.prisma.documentType.create({
      data: {
        name: createDocumentTypeDto.name,
        description: createDocumentTypeDto.description,
      },
    });
  }

  findAll() {
    return this.prisma.documentType.findMany();
  }

  async findOne(id: number) {
    const documentType = await this.prisma.documentType.findUnique({
      where: { id },
    });

    if (!documentType) {
      throw new NotFoundException(
        `Tipo de documento com id ${id} não encontrado`,
      );
    }

    return documentType;
  }

  async update(id: number, updateDocumentTypeDto: UpdateDocumentTypeDto) {
    await this.findOne(id);

    if (updateDocumentTypeDto.name) {
      const existingType = await this.prisma.documentType.findUnique({
        where: { name: updateDocumentTypeDto.name },
      });

      if (existingType && existingType.id !== id) {
        throw new ConflictException(
          `Tipo de documento ${updateDocumentTypeDto.name} já existe`,
        );
      }
    }

    return this.prisma.documentType.update({
      where: { id },
      data: {
        name: updateDocumentTypeDto.name,
        description: updateDocumentTypeDto.description,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.documentType.delete({ where: { id } });
  }
}
