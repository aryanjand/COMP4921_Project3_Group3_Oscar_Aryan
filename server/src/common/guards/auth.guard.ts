import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { IS_PUBLIC_KEY } from '../public.metadata';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const token = this.extractJwtToken(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const expiredToken = await this.prisma.expiredJwt.findFirst({
        where: {
          token: token,
        },
      });

      if (expiredToken) {
        throw new UnauthorizedException();
      }

      const payload = await this.jwt.verifyAsync(token);

      request.user = payload;
      return true;
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new InternalServerErrorException(err.message);
    }
  }

  private extractJwtToken(req: Request) {
    const token = req.cookies[this.config.get('TOKEN_NAME', 'aryan.sid')];
    return token;
  }
}
