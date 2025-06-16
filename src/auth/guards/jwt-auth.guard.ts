import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'src/types/Auth';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context
      .switchToHttp()
      .getRequest<Request & { user?: JwtPayload }>();
    const authHeaders = req.headers['authorization'];

    if (!authHeaders?.startsWith('Bearer ')) {
      throw new UnauthorizedException();
    }

    const token = authHeaders.replace('Bearer ', '');
    const jwtSecret = this.configService.get<string>('JWT_SECRET') || '';

    try {
      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
      req.user = decoded;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}
