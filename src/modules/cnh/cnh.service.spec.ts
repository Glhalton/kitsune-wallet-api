import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service.js';
import { CnhService } from './cnh.service.js';

describe('CnhService', () => {
  let service: CnhService;
  let prisma: {
    document: { findFirst: ReturnType<typeof vi.fn> };
    cnh: {
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
  const createCnhDto = {
    documentId: document.id,
    registerNumber: '12345678900',
    category: 'AB',
    expirationDate: '2030-06-01',
    issueDate: '2020-06-01',
  };
  const cnh = {
    id: 3,
    ...createCnhDto,
    expirationDate: new Date('2030-06-01'),
    issueDate: new Date('2020-06-01'),
  };

  beforeEach(async () => {
    prisma = {
      document: { findFirst: vi.fn() },
      cnh: {
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [CnhService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<CnhService>(CnhService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a CNH converting the dates', async () => {
    prisma.document.findFirst.mockResolvedValue(document);
    prisma.cnh.findUnique.mockResolvedValue(null);
    prisma.cnh.create.mockResolvedValue(cnh);

    await expect(service.create(userId, createCnhDto)).resolves.toEqual(cnh);

    expect(prisma.cnh.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          expirationDate: new Date('2030-06-01'),
          issueDate: new Date('2020-06-01'),
        }),
      }),
    );
  });

  it('rejects a CNH for a document the user does not own', async () => {
    prisma.document.findFirst.mockResolvedValue(null);

    await expect(service.create(userId, createCnhDto)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('rejects a document that already has a CNH', async () => {
    prisma.document.findFirst.mockResolvedValue(document);
    prisma.cnh.findUnique.mockResolvedValue(cnh);

    await expect(service.create(userId, createCnhDto)).rejects.toThrow(
      ConflictException,
    );
  });

  it('rejects an unknown CNH on findOne', async () => {
    prisma.cnh.findFirst.mockResolvedValue(null);

    await expect(service.findOne(userId, 99)).rejects.toThrow(
      NotFoundException,
    );
  });
});
