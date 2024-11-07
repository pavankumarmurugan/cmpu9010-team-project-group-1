import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class OriginMiddleware implements NestMiddleware {
  private readonly whitelistedOrigins: string[];
  private readonly isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.whitelistedOrigins =
      process.env.WHITELISTED_ORIGINS?.split(',')
        .map((origin) => origin.trim())
        .filter(Boolean) ?? [];

    if (!this.whitelistedOrigins.length && !this.isDevelopment) {
      throw new Error(
        'WHITELISTED_ORIGINS environment variable must be set in production',
      );
    }
  }

  use(req: Request, res: Response, next: NextFunction) {
    if (this.isDevelopment) {
      return next();
    }

    const origin =
      (req.headers as any).origin ||
      req.headers['referer'] ||
      (req as any).get('origin');
    const host = (req.headers as any).host;

    if (origin) {
      try {
        const cleanOrigin = new URL(origin).origin;
        if (this.whitelistedOrigins.includes(cleanOrigin)) {
          return next();
        }
      } catch (error) {
        throw new ForbiddenException('Access Denied: Invalid origin format');
      }
    }

    if (this.whitelistedOrigins.some((allowed) => host?.includes(allowed))) {
      return next();
    }

    throw new ForbiddenException('Access Denied: Origin not allowed');
  }
}
