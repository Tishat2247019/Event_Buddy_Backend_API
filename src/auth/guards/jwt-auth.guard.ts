import {
  Injectable,
  UnauthorizedException,
  ExecutionContext,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlacklistToken } from '../entities/blackListToken.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    @InjectRepository(BlacklistToken)
    private readonly blacklistRepo: Repository<BlacklistToken>,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const token = authHeader.replace('Bearer ', '');

    const isBlacklisted = await this.blacklistRepo.findOne({
      where: { token },
    });
    if (isBlacklisted) {
      throw new UnauthorizedException('Token has been blacklisted');
    }

    return super.canActivate(context) as Promise<boolean>;
  }
}
