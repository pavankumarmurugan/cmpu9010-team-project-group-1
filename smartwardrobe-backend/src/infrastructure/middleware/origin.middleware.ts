import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class OriginMiddleware implements NestMiddleware {
  private readonly whitelistedOrigins =
    process.env.WHITELISTED_ORIGINS?.split(',');

  use(req: Request, res: Response, next: NextFunction) {
    const origin = req.headers.origin || req.headers.referer;
    if (!origin || !this.whitelistedOrigins?.includes(origin)) {
      throw new ForbiddenException('Access Denied: Origin not allowed');
    }
    next();
  }
}
