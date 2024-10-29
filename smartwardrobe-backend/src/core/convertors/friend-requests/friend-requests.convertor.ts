import { Injectable } from '@nestjs/common';
import { FriendRequestsReqDto } from 'src/core/dto/friend-requests/friend-requests.req-dto';
import { UpdateFriendRequestsReqDto } from 'src/core/dto/friend-requests/friend-requests.req-update-dto';
import { FriendRequestsResDto } from 'src/core/dto/friend-requests/friend-requests.res-dto';
import { FriendRequestsEntity } from 'src/core/entities/friend-request/friend-requests.entity';

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
      updatedAt: new Date(),
    };
  }
}
