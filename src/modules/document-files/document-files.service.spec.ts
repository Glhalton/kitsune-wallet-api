import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service.js';
import { DocumentFilesService } from './document-files.service.js';

describe('DocumentFilesService', () => {
  let service: DocumentFilesService;
  let prisma: {
    document: { findFirst: ReturnType<typeof vi.fn> };
    documentFile: {
      findFirst: ReturnType<typeof vi.fn>;
      findMany: ReturnType<typeof vi.fn>;
      create: ReturnType<typeof vi.fn>;
      update: ReturnType<typeof vi.fn>;
      delete: ReturnType<typeof vi.fn>;
    };
  };

  const userId = 1;
  const document = { id: 5, userId, typeId: 10 };
  const file = {
    id: 7,
    documentId: document.id,
    storageKey: 'documents/5/front.png',
    mimeType: 'image/png',
    size: 1024n,
  };

  beforeEach(async () => {
    prisma = {
      document: { findFirst: vi.fn() },
      documentFile: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentFilesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<DocumentFilesService>(DocumentFilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a file and serializes the size as number', async () => {
    prisma.document.findFirst.mockResolvedValue(document);
    prisma.documentFile.create.mockResolvedValue(file);

    await expect(
      service.create(userId, {
        documentId: file.documentId,
        storageKey: file.storageKey,
        mimeType: file.mimeType,
        size: 1024,
      }),
    ).resolves.toEqual({ ...file, size: 1024 });
  });

  it('rejects a file for a document the user does not own', async () => {
    prisma.document.findFirst.mockResolvedValue(null);

    await expect(
      service.create(userId, {
        documentId: file.documentId,
        storageKey: file.storageKey,
        mimeType: file.mimeType,
        size: 1024,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('lists only files of the current user documents', async () => {
    prisma.documentFile.findMany.mockResolvedValue([file]);

    await expect(service.findAll(userId)).resolves.toEqual([
      { ...file, size: 1024 },
    ]);

    expect(prisma.documentFile.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { document: { userId } } }),
    );
  });

  it('rejects an unknown file on findOne', async () => {
    prisma.documentFile.findFirst.mockResolvedValue(null);

    await expect(service.findOne(userId, 99)).rejects.toThrow(
      NotFoundException,
    );
  });
});
