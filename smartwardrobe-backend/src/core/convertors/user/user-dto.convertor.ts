import { Injectable } from '@nestjs/common';
import { RefreshTokenResDto } from 'src/core/dto/auth/refresh-token-dto.class';
import { UpdateProfileUserReqDTO } from 'src/core/dto/user/user-req-update-profile.dto';
import { UserReqDTO } from 'src/core/dto/user/user-req.dto';
import { UserResDTO } from 'src/core/dto/user/user-res.dto';
import { UserEntity } from 'src/core/entities/user/user.entity';

@Injectable()
export class UserDtoConvertor {
  toUserResDTOFromEntity(entities: UserEntity[]): UserResDTO[] {
    return entities.map(({ firstname, lastname, username, userId, role }) => ({
      firstname,
      lastname,
      username,
      userId,
      role,
    }));
  }
  toEntityFromUserReqDTO(dto: UserReqDTO, hashPassword: string): UserEntity {
    const { firstname, lastname, username, role } = dto;

    return {
      firstname,
      lastname,
      password: hashPassword,
      username,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
  toUserLoginInfoResDTOForCreate(
    entity: UserEntity,
    token: string,
    refreshToken: string,
  ): UserResDTO {
    const { firstname, lastname, username, userId } = entity;
    return {
      firstname,
      lastname,
      username,
      userId,
      refreshToken,
      token,
    };
  }

  toUserLoginEntityForUpdateRefreshToken(refreshToken: string): UserEntity {
    return {
      refreshToken,
      updatedAt: new Date(),
    };
  }

  toUpdateUserEntityFromDto(
    updateProfileUserReqDTO: UpdateProfileUserReqDTO,
  ): UserEntity {
    return { ...updateProfileUserReqDTO };
  }

  toUserResDTOFromGetMyProfile(entity: UserEntity): UserResDTO {
    const { firstname, lastname, username, userId, role } = entity;
    return {
      firstname,
      lastname,
      username,
      userId,
      role,
    };
  }

  toUserLoginInfoResDTOFromGetMyProfile(entity: UserEntity): UserResDTO {
    const { lastname, username, userId, role, email, dob } = entity;
    return {
      lastname,
      username,
      userId,
      role,
      email,
      dob,
    };
  }

  toUpdateUserEntityFromUpdatePasswordDto(password: string): UserEntity {
    return { password };
  }

  toRefreshTokenResDtoFromRefreshToken(
    token: string,
    refreshToken: string,
  ): RefreshTokenResDto {
    return { refreshToken, token };
  }
}
