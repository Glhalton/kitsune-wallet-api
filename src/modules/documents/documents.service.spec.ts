import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service.js';
import { DocumentsService } from './documents.service.js';

describe('DocumentsService', () => {
  let service: DocumentsService;
  let prisma: {
    document: {
      findFirst: ReturnType<typeof vi.fn>;
      findMany: ReturnType<typeof vi.fn>;
      create: ReturnType<typeof vi.fn>;
      update: ReturnType<typeof vi.fn>;
      delete: ReturnType<typeof vi.fn>;
    };
    documentType: { findUnique: ReturnType<typeof vi.fn> };
  };

  const userId = 1;
  const documentType = {
    id: 10,
    name: 'RG',
    description: 'Carteira de identidade',
  };
  const document = { id: 5, userId, typeId: documentType.id };

  beforeEach(async () => {
    prisma = {
      document: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      documentType: { findUnique: vi.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a document for the current user', async () => {
    prisma.documentType.findUnique.mockResolvedValue(documentType);
    prisma.document.create.mockResolvedValue(document);

    await expect(
      service.create(userId, { typeId: documentType.id }),
    ).resolves.toEqual(document);

    expect(prisma.document.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { userId, typeId: documentType.id },
      }),
    );
  });

  it('rejects an unknown document type on create', async () => {
    prisma.documentType.findUnique.mockResolvedValue(null);

    await expect(service.create(userId, { typeId: 99 })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('lists only the current user documents', async () => {
    prisma.document.findMany.mockResolvedValue([document]);

    await service.findAll(userId);

    expect(prisma.document.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId } }),
    );
  });

  it('rejects a document that belongs to another user', async () => {
    prisma.document.findFirst.mockResolvedValue(null);

    await expect(service.findOne(userId, document.id)).rejects.toThrow(
      NotFoundException,
    );

    expect(prisma.document.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: document.id, userId } }),
    );
  });

  it('removes an owned document', async () => {
    prisma.document.findFirst.mockResolvedValue(document);
    prisma.document.delete.mockResolvedValue(document);

    await service.remove(userId, document.id);

    expect(prisma.document.delete).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: document.id } }),
    );
  });
});
