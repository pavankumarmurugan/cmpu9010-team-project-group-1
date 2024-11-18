import { ConflictException, Injectable } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
// import { FriendsConvertor } from 'src/core/convertors/friends/friend.convertor';
import { UserDtoConvertor } from 'src/core/convertors/user/user-dto.convertor';

import { FriendsReqDto } from 'src/core/dto/friends/friends.req-dto';
import { FriendsResDto } from 'src/core/dto/friends/friends.res-dto';
import { UserResDTO } from 'src/core/dto/user/user-res.dto';
import { FriendsEntity } from 'src/core/entities/friends/friends';
import { UserEntity } from 'src/core/entities/user/user.entity';
import { IResponse } from 'src/core/interface/response.interface';
import { MESSAGES } from 'src/infrastructure/common/enum.ts/messages';

@Injectable()
export class FriendsUsecase {
  constructor(
    private readonly databaseService: IDataServices,
    // private readonly convertor: FriendsConvertor,
    private readonly userConvertor: UserDtoConvertor,
  ) {}

  // async create(dto: FriendsReqDto): Promise<IResponse<FriendsResDto>> {
  //   try {
  //     const friendsEntity: FriendsEntity =
  //       this.convertor.toFriendsModelFromDto(dto);
  //     const entity: FriendsEntity =
  //       await this.databaseService.friends.create(friendsEntity);
  //     const data: FriendsResDto =
  //       this.convertor.toFriendsResDtoFromEntity(entity);
  //     return {
  //       data,
  //       message: MESSAGES.FRIENDS.CREATE.SUCCESS,
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async getAll(userId: number): Promise<IResponse<UserResDTO[]>> {
  //   try {
  //     const results = await Promise.all([
  //       this.databaseService.friends.getAllByProperties({
  //         user1Id: userId,
  //       }),
  //       this.databaseService.friends.getAllByProperties({
  //         user2Id: userId,
  //       }),
  //     ]);

  //     const friendsEntity: number[] = results.flat().map((entity) => {
  //       if (entity.user1Id !== userId) {
  //         return entity.user1Id;
  //       }
  //       return entity.user2Id;
  //     });

  //     const userEntity: UserEntity[] = await Promise.all(
  //       friendsEntity.map((id) =>
  //         this.databaseService.users.get({ userId: id }),
  //       ),
  //     );

  //     const data = this.userConvertor.toUserResDTOFromFriendsEntity(
  //       results.flat(),
  //       userEntity,
  //     );

  //     return {
  //       data,
  //       message: MESSAGES.FRIENDS.GET.SUCCESS,
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async getAll(userId: number): Promise<IResponse<UserResDTO[]>> {
    try {
      const friends = await this.databaseService.friends.getAllWithOrConditions(
        [{ user1Id: userId }, { user2Id: userId }],
        ['user1', 'user2'],
      );

      const friendIds = [
        ...new Set(
          friends.map((friend) =>
            friend.user1Id === userId ? friend.user2Id : friend.user1Id,
          ),
        ),
      ];

      const users = await this.databaseService.users.getAllByIdsIn(
        friendIds,
        'userId',
      );

      const data = this.userConvertor.toUserResDTOFromFriendsEntity(
        friends,
        users,
      );

      return {
        data,
        message: MESSAGES.FRIENDS.GET.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(userId: number, friendId: number): Promise<IResponse<null>> {
    try {
      const friendsEntity: FriendsEntity =
        await this.databaseService.friends.get({
          friendId,
        });

      if (!friendsEntity) {
        throw new ConflictException(MESSAGES.FRIENDS.DELETE.NOT_FOUND);
      }
      const { user1Id, user2Id } = friendsEntity;

      if (userId === user1Id || userId === user2Id) {
        const result1 = await this.databaseService.friendRequests.get({
          senderId: user1Id,
          receiverId: user2Id,
        });

        const result2 = await this.databaseService.friendRequests.get({
          senderId: user2Id,
          receiverId: user1Id,
        });

        if (result1) {
          const { requestId } = result1;
          await this.databaseService.friendRequests.delete(requestId);
        }

        if (result2) {
          const { requestId } = result2;
          await this.databaseService.friendRequests.delete(requestId);
        }

        await this.databaseService.friends.delete(friendId);
        return {
          data: null,
          message: MESSAGES.FRIENDS.DELETE.SUCCESS,
        };
      }

      throw new ConflictException(MESSAGES.FRIENDS.DELETE.NOT_AUTHORIZED);
    } catch (error) {
      throw error;
    }
  }
}
