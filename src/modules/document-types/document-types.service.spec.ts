import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service.js';
import { DocumentTypesService } from './document-types.service.js';

describe('DocumentTypesService', () => {
  let service: DocumentTypesService;
  let prisma: {
    documentType: {
      findUnique: ReturnType<typeof vi.fn>;
      findMany: ReturnType<typeof vi.fn>;
      create: ReturnType<typeof vi.fn>;
      update: ReturnType<typeof vi.fn>;
      delete: ReturnType<typeof vi.fn>;
    };
  };

  const documentType = {
    id: 1,
    name: 'RG',
    description: 'Carteira de identidade',
  };

  beforeEach(async () => {
    prisma = {
      documentType: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentTypesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<DocumentTypesService>(DocumentTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a document type', async () => {
    prisma.documentType.findUnique.mockResolvedValue(null);
    prisma.documentType.create.mockResolvedValue(documentType);

    await expect(
      service.create({
        name: documentType.name,
        description: documentType.description,
      }),
    ).resolves.toEqual(documentType);
  });

  it('rejects a duplicated name on create', async () => {
    prisma.documentType.findUnique.mockResolvedValue(documentType);

    await expect(
      service.create({
        name: documentType.name,
        description: documentType.description,
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('rejects an unknown document type on findOne', async () => {
    prisma.documentType.findUnique.mockResolvedValue(null);

    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });

  it('rejects a name already used by another type on update', async () => {
    prisma.documentType.findUnique
      .mockResolvedValueOnce(documentType)
      .mockResolvedValueOnce({ ...documentType, id: 2 });

    await expect(
      service.update(documentType.id, { name: documentType.name }),
    ).rejects.toThrow(ConflictException);
  });
});
