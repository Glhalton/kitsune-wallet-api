import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service.js';
import { RgService } from './rg.service.js';

describe('RgService', () => {
  let service: RgService;
  let prisma: {
    document: { findFirst: ReturnType<typeof vi.fn> };
    rg: {
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
  const createRgDto = {
    documentId: document.id,
    issuingAuthority: 'SSP',
    registerNumber: '123456789',
    cpf: '12345678901',
    militaryCertification: '987654',
    uf: 'SP',
    issueDate: '2020-01-15',
  };
  const rg = { id: 3, ...createRgDto, issueDate: new Date('2020-01-15') };

  beforeEach(async () => {
    prisma = {
      document: { findFirst: vi.fn() },
      rg: {
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [RgService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<RgService>(RgService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates an RG converting the issue date', async () => {
    prisma.document.findFirst.mockResolvedValue(document);
    prisma.rg.findUnique.mockResolvedValue(null);
    prisma.rg.create.mockResolvedValue(rg);

    await expect(service.create(userId, createRgDto)).resolves.toEqual(rg);

    expect(prisma.rg.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ issueDate: new Date('2020-01-15') }),
      }),
    );
  });

  it('rejects an RG for a document the user does not own', async () => {
    prisma.document.findFirst.mockResolvedValue(null);

    await expect(service.create(userId, createRgDto)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('rejects a document that already has an RG', async () => {
    prisma.document.findFirst.mockResolvedValue(document);
    prisma.rg.findUnique.mockResolvedValue(rg);

    await expect(service.create(userId, createRgDto)).rejects.toThrow(
      ConflictException,
    );
  });

  it('rejects an unknown RG on findOne', async () => {
    prisma.rg.findFirst.mockResolvedValue(null);

    await expect(service.findOne(userId, 99)).rejects.toThrow(
      NotFoundException,
    );
  });
});
