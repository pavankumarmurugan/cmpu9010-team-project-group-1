import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/core/interface/jwt-payload.interface';
import { UserEntity } from 'src/core/entities/user/user.entity';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload): UserEntity {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    return {
      userId: +payload.sub,
      refreshToken,
    };
  }
}
