import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service.js';
import { ElectoralCardsService } from './electoral-cards.service.js';

describe('ElectoralCardsService', () => {
  let service: ElectoralCardsService;
  let prisma: {
    document: { findFirst: ReturnType<typeof vi.fn> };
    electoralCard: {
      findUnique: ReturnType<typeof vi.fn>;
      findFirst: ReturnType<typeof vi.fn>;
      findMany: ReturnType<typeof vi.fn>;
      create: ReturnType<typeof vi.fn>;
      update: ReturnType<typeof vi.fn>;
      delete: ReturnType<typeof vi.fn>;
    };
  };

  const userId = 1;
  const document = { id: 5, userId, typeId: 10 };
  const createElectoralCardDto = {
    documentId: document.id,
    voterRegistration: '123456789012',
    zone: 10,
    section: 25,
    electoralCity: 'São Paulo',
    electoralState: 'SP',
  };
  const electoralCard = { id: 3, ...createElectoralCardDto };

  beforeEach(async () => {
    prisma = {
      document: { findFirst: vi.fn() },
      electoralCard: {
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ElectoralCardsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ElectoralCardsService>(ElectoralCardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates an electoral card', async () => {
    prisma.document.findFirst.mockResolvedValue(document);
    prisma.electoralCard.findUnique.mockResolvedValue(null);
    prisma.electoralCard.create.mockResolvedValue(electoralCard);

    await expect(
      service.create(userId, createElectoralCardDto),
    ).resolves.toEqual(electoralCard);
  });

  it('rejects a card for a document the user does not own', async () => {
    prisma.document.findFirst.mockResolvedValue(null);

    await expect(
      service.create(userId, createElectoralCardDto),
    ).rejects.toThrow(NotFoundException);
  });

  it('rejects a document that already has an electoral card', async () => {
    prisma.document.findFirst.mockResolvedValue(document);
    prisma.electoralCard.findUnique.mockResolvedValue(electoralCard);

    await expect(
      service.create(userId, createElectoralCardDto),
    ).rejects.toThrow(ConflictException);
  });

  it('rejects an unknown card on findOne', async () => {
    prisma.electoralCard.findFirst.mockResolvedValue(null);

    await expect(service.findOne(userId, 99)).rejects.toThrow(
      NotFoundException,
    );
  });
});
