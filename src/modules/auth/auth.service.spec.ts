import { UnauthorizedException } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import bcrypt from 'bcryptjs';
import { PrismaService } from '../../database/prisma.service.js';
import { AuthService } from './auth.service.js';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let prisma: { user: { findUnique: ReturnType<typeof vi.fn> } };

  const password = 'correct-password';
  const user = {
    id: 1,
    name: 'Kitsune',
    email: 'kitsune@example.com',
    password: bcrypt.hashSync(password, 4),
    isActive: true,
  };

  beforeEach(async () => {
    prisma = { user: { findUnique: vi.fn() } };

    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'test-secret' })],
      providers: [AuthService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns an access token carrying the user id', async () => {
    prisma.user.findUnique.mockResolvedValue(user);

    const { accessToken } = await service.login({
      email: user.email,
      password,
    });

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: user.email },
    });
    expect(jwtService.verify(accessToken)).toMatchObject({ sub: user.id });
  });

  it('rejects an unknown email', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(
      service.login({ email: 'nobody@example.com', password }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('rejects a wrong password', async () => {
    prisma.user.findUnique.mockResolvedValue(user);

    await expect(
      service.login({ email: user.email, password: 'wrong-password' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('rejects an inactive user', async () => {
    prisma.user.findUnique.mockResolvedValue({ ...user, isActive: false });

    await expect(
      service.login({ email: user.email, password }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('returns the current user without the password', async () => {
    prisma.user.findUnique.mockResolvedValue(user);

    await expect(service.me(user.id)).resolves.toEqual({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  });

  it('rejects the current user lookup for an inactive user', async () => {
    prisma.user.findUnique.mockResolvedValue({ ...user, isActive: false });

    await expect(service.me(user.id)).rejects.toThrow(UnauthorizedException);
  });
});
