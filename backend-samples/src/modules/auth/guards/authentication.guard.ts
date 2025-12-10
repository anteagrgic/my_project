import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { SKIP_AUTH_KEY } from '../decorators/public-endpoint.decorator';
import {
  IJWTProvider,
  JWTProviderToken,
} from '../interfaces/jwt-token/jwt-provider.service.interface';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    @Inject(JWTProviderToken) private readonly jwtProvider: IJWTProvider,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skipAuth) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Forbidden access to the resource.');
    }

    const ctx = this.jwtProvider.verify(token);
    request.user = { userId: ctx.subject };

    return true;
  }

  private extractTokenFromHeader(request: Request): string {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
