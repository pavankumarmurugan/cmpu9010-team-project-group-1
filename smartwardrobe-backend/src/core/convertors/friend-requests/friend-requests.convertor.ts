import { Injectable } from '@nestjs/common';
import { FriendRequestsReqDto } from 'src/core/dto/friend-requests/friend-requests.req-dto';
import { UpdateFriendRequestsReqDto } from 'src/core/dto/friend-requests/friend-requests.req-update-dto';
import { FriendRequestsResDto } from 'src/core/dto/friend-requests/friend-requests.res-dto';
import { FriendRequestsEntity } from 'src/core/entities/friend-request/friend-requests.entity';
import { UserEntity } from 'src/core/entities/user/user.entity';
import { FRIEND_REQUEST_STATUS } from 'src/infrastructure/common/enum.ts/friend-requests.enum';

@Injectable()
export class FriendRequestsConvertor {
  toFriendRequestsResDtoFromEntity(
    entity: FriendRequestsEntity,
  ): FriendRequestsResDto {
    return { ...entity };
  }

  toFriendRequestsResDtoFromEntities(
    entity: FriendRequestsEntity[],
  ): FriendRequestsResDto[] {
    return entity.map((item) => ({ ...item }));
  }

  toFriendRequestsModelFromDto(
    userId: number,
    dto: FriendRequestsReqDto,
  ): FriendRequestsEntity {
    return {
      ...dto,
      senderId: userId,
      status: 'pending',
    };
  }

  toUpdateFriendRequestsModelFromDto(
    dto: UpdateFriendRequestsReqDto,
  ): FriendRequestsEntity {
    return {
      ...dto,
      status: FRIEND_REQUEST_STATUS.ACCEPTED,
      updatedAt: new Date(),
    };
  }

  toUserResDTOFromFriendRequestUsecase(
    entities: UserEntity[],
    pendingFriendRequests: FriendRequestsEntity[],
  ): FriendRequestsResDto[] {
    return pendingFriendRequests.map((item) => {
      const { firstname, lastname, username, userId, role, profilePic } =
        entities.find(({ userId }) => userId === item.senderId);
      return {
        ...item,
        user: {
          firstname,
          lastname,
          username,
          userId,
          role,
          profilePic,
        },
      };
    });
  }
}
