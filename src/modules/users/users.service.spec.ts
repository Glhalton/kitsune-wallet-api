import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service.js';
import { UsersService } from './users.service.js';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: {
    user: {
      findUnique: ReturnType<typeof vi.fn>;
      findMany: ReturnType<typeof vi.fn>;
      create: ReturnType<typeof vi.fn>;
      update: ReturnType<typeof vi.fn>;
    };
  };

  const user = {
    id: 1,
    name: 'Kitsune',
    email: 'kitsune@example.com',
  };

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a user with a hashed password', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue(user);

    await expect(
      service.create({
        name: user.name,
        email: user.email,
        password: 'secret',
      }),
    ).resolves.toEqual(user);

    const data = prisma.user.create.mock.calls[0][0].data;
    expect(data.password).not.toBe('secret');
  });

  it('rejects a duplicated email on create', async () => {
    prisma.user.findUnique.mockResolvedValue(user);

    await expect(
      service.create({
        name: user.name,
        email: user.email,
        password: 'secret',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('rejects an unknown user on findOne', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });

  it('deactivates the user on remove', async () => {
    prisma.user.findUnique.mockResolvedValue(user);
    prisma.user.update.mockResolvedValue(user);

    await service.remove(user.id);

    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: user.id },
        data: { isActive: false },
      }),
    );
  });
});
