import { Injectable } from '@nestjs/common';
import { AuthLoginResDto } from 'src/core/dto/auth/auth-res-dto.class';
import { UserEntity } from 'src/core/entities/user/user.entity';

@Injectable()
export class AuthDtoConvertor {
  toAuthLoginResDtoFromUserEntity(
    entity: UserEntity,
    token: string,
    refreshToken: string,
  ): AuthLoginResDto {
    const { userId, username, role } = entity;
    return {
      token,
      userId,
      username,
      refreshToken,
      role,
    };
  }
}
