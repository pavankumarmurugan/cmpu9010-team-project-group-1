import { Injectable } from '@nestjs/common';
import { RefreshTokenResDto } from 'src/core/dto/auth/refresh-token-dto.class';
import { UpdateProfileUserReqDTO } from 'src/core/dto/user/user-req-update-profile.dto';
import { UserReqDTO } from 'src/core/dto/user/user-req.dto';
import { UserResDTO } from 'src/core/dto/user/user-res.dto';
import { FriendRequestsEntity } from 'src/core/entities/friend-request/friend-requests.entity';
import { FriendsEntity } from 'src/core/entities/friends/friends';
import { UserEntity } from 'src/core/entities/user/user.entity';
import { FRIEND_REQUEST_STATUS } from 'src/infrastructure/common/enum.ts/friend-requests.enum';

@Injectable()
export class UserDtoConvertor {
  toUserResDTOFromEntity(entities: UserEntity[]): UserResDTO[] {
    return entities.map(
      ({ firstname, lastname, username, userId, role, profilePic }) => ({
        firstname,
        lastname,
        username,
        userId,
        role,
        profilePic,
      }),
    );
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
    const { firstname, lastname, username, userId, role, profilePic } = entity;
    return {
      firstname,
      lastname,
      username,
      userId,
      role,
      profilePic,
    };
  }

  toUserLoginInfoResDTOFromGetMyProfile(entity: UserEntity): UserResDTO {
    const {
      firstname,
      lastname,
      username,
      userId,
      role,
      email,
      dob,
      profilePic,
    } = entity;
    return {
      firstname,
      lastname,
      username,
      userId,
      role,
      email,
      dob,
      profilePic,
    };
  }

  toUpdateUserEntityFromUpdatePasswordDto(password: string): UserEntity {
    return { password };
  }

  toUpdateProfilePhoto(profilePic: string): UserEntity {
    return { profilePic };
  }

  toRefreshTokenResDtoFromRefreshToken(
    token: string,
    refreshToken: string,
  ): RefreshTokenResDto {
    return { refreshToken, token };
  }

  toUserResDTOFromFriendsEntity(
    friendEntities: FriendsEntity[],
    entities: UserEntity[],
  ): UserResDTO[] {
    return entities.map(({ firstname, lastname, username, userId, role }) => {
      const { friendId } = friendEntities.find(
        (friendEntity) =>
          friendEntity.user1Id === userId || friendEntity.user2Id === userId,
      );
      return {
        firstname,
        lastname,
        username,
        userId,
        role,
        friendId,
      };
    });
  }
  toUserResDTOFromEntityForSearch(
    friendRequestsEntities: FriendRequestsEntity[],
    entities: UserEntity[],
  ): UserResDTO[] {
    return entities.map(
      ({ firstname, lastname, username, userId, role, profilePic }) => {
        const hasSenderId = friendRequestsEntities.some(
          (friendRequestsEntity) =>
            friendRequestsEntity.receiverId === userId &&
            friendRequestsEntity.status === FRIEND_REQUEST_STATUS.PENDING,
        );
        return {
          firstname,
          lastname,
          username,
          userId,
          role,
          profilePic,
          status: hasSenderId ? FRIEND_REQUEST_STATUS.PENDING : null,
        };
      },
    );
  }
}
