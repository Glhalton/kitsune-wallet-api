import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateElectoralCardDto } from './dto/create-electoral-card.dto.js';
import { UpdateElectoralCardDto } from './dto/update-electoral-card.dto.js';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class ElectoralCardsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createElectoralCardDto: CreateElectoralCardDto) {
    await this.findOwnedDocument(userId, createElectoralCardDto.documentId);

    const existingCard = await this.prisma.electoralCard.findUnique({
      where: { documentId: createElectoralCardDto.documentId },
    });

    if (existingCard) {
      throw new ConflictException(
        `Documento com id ${createElectoralCardDto.documentId} já possui um título de eleitor`,
      );
    }

    return this.prisma.electoralCard.create({
      data: {
        documentId: createElectoralCardDto.documentId,
        voterRegistration: createElectoralCardDto.voterRegistration,
        zone: createElectoralCardDto.zone,
        section: createElectoralCardDto.section,
        electoralCity: createElectoralCardDto.electoralCity,
        electoralState: createElectoralCardDto.electoralState,
      },
    });
  }

  findAll(userId: number) {
    return this.prisma.electoralCard.findMany({
      where: { document: { userId } },
    });
  }

  async findOne(userId: number, id: number) {
    const electoralCard = await this.prisma.electoralCard.findFirst({
      where: { id, document: { userId } },
    });

    if (!electoralCard) {
      throw new NotFoundException(
        `Título de eleitor com id ${id} não encontrado`,
      );
    }

    return electoralCard;
  }

  async update(
    userId: number,
    id: number,
    updateElectoralCardDto: UpdateElectoralCardDto,
  ) {
    await this.findOne(userId, id);

    return this.prisma.electoralCard.update({
      where: { id },
      data: {
        voterRegistration: updateElectoralCardDto.voterRegistration,
        zone: updateElectoralCardDto.zone,
        section: updateElectoralCardDto.section,
        electoralCity: updateElectoralCardDto.electoralCity,
        electoralState: updateElectoralCardDto.electoralState,
      },
    });
  }

  async remove(userId: number, id: number) {
    await this.findOne(userId, id);

    return this.prisma.electoralCard.delete({ where: { id } });
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
