import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserEntity } from 'src/core/entities/user/user.entity';
import { JwtPayload } from 'src/core/interface/jwt-payload.interface';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    console.log('process.env.JWT_ACCESS_SECRET', process.env.JWT_ACCESS_SECRET);

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  validate(payload: JwtPayload): UserEntity {
    return {
      userId: +payload.sub,
      role: payload.data.role,
    };
  }
}
