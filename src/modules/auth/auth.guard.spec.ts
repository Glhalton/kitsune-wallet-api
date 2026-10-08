import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard.js';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: JwtService;
  let reflector: Reflector;

  const contextFor = (request: { headers: Record<string, string> }) =>
    ({
      getHandler: () => undefined,
      getClass: () => undefined,
      switchToHttp: () => ({ getRequest: () => request }),
    }) as unknown as ExecutionContext;

  beforeEach(() => {
    jwtService = new JwtService({ secret: 'test-secret' });
    reflector = new Reflector();
    guard = new AuthGuard(jwtService, reflector);
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
  });

  it('lets public routes through without a token', async () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

    await expect(guard.canActivate(contextFor({ headers: {} }))).resolves.toBe(
      true,
    );
  });

  it('attaches the user from a valid token', async () => {
    const token = await jwtService.signAsync({ sub: 7 });
    const request = { headers: { authorization: `Bearer ${token}` } };

    await expect(guard.canActivate(contextFor(request))).resolves.toBe(true);
    expect(request).toMatchObject({ user: { id: 7 } });
  });

  it('rejects a request without a token', async () => {
    await expect(
      guard.canActivate(contextFor({ headers: {} })),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('rejects a non-Bearer authorization header', async () => {
    const token = await jwtService.signAsync({ sub: 7 });
    const request = { headers: { authorization: `Basic ${token}` } };

    await expect(guard.canActivate(contextFor(request))).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('rejects a token signed with another secret', async () => {
    const token = await new JwtService({ secret: 'other' }).signAsync({
      sub: 7,
    });
    const request = { headers: { authorization: `Bearer ${token}` } };

    await expect(guard.canActivate(contextFor(request))).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('rejects an expired token', async () => {
    const token = await jwtService.signAsync({ sub: 7 }, { expiresIn: -10 });
    const request = { headers: { authorization: `Bearer ${token}` } };

    await expect(guard.canActivate(contextFor(request))).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
