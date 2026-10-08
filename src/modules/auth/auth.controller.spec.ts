import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: {
    login: ReturnType<typeof vi.fn>;
    me: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    authService = { login: vi.fn(), me: vi.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates login to the service', async () => {
    const loginDto = { email: 'kitsune@example.com', password: 'secret' };
    authService.login.mockResolvedValue({ accessToken: 'token' });

    await expect(controller.login(loginDto)).resolves.toEqual({
      accessToken: 'token',
    });
    expect(authService.login).toHaveBeenCalledWith(loginDto);
  });

  it('returns the user identified by the token', async () => {
    const user = { id: 7, name: 'Kitsune', email: 'kitsune@example.com' };
    authService.me.mockResolvedValue(user);

    await expect(controller.me({ id: 7 })).resolves.toEqual(user);
    expect(authService.me).toHaveBeenCalledWith(7);
  });
});
