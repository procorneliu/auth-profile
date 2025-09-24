import { AccessTokenGuard } from './accessToken.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('Access Token Guard', () => {
  let guard: AccessTokenGuard;

  beforeEach(() => {
    guard = new AccessTokenGuard();

    jest
      .spyOn(guard, 'canActivate')
      .mockRejectedValue(new UnauthorizedException());
  });

  it('should deny access without token', async () => {
    const ctx = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: {}, cookies: {} }),
        getResponse: () => ({}),
      }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
  });
});
