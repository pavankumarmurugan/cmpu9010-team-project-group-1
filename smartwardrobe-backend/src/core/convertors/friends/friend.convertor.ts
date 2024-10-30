import { Injectable } from '@nestjs/common';
import { FriendsReqDto } from 'src/core/dto/friends/friends.req-dto';
import { FriendsResDto } from 'src/core/dto/friends/friends.res-dto';
import { FriendsEntity } from 'src/core/entities/friends/friends';

@Injectable()
export class FriendsConvertor {
  toFriendsResDtoFromEntity(entity: FriendsEntity): FriendsResDto {
    return { ...entity };
  }

  toFriendsResDtoFromEntities(entities: FriendsEntity[]): FriendsResDto[] {
    return entities.map((entity) => ({ ...entity }));
  }

  toFriendsModelFromDto(dto: FriendsReqDto): FriendsEntity {
    return {
      user1Id: dto.user1Id,
      user2Id: dto.user2Id,
    };
  }
}
