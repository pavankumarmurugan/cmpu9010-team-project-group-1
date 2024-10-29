import { Injectable } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
import { FriendRequestsConvertor } from 'src/core/convertors/frriend-requests/friend-requests.convertor';
import { FriendRequestsReqDto } from 'src/core/dto/friend-requests/friend-requests.req-dto';
import { UpdateFriendRequestsReqDto } from 'src/core/dto/friend-requests/friend-requests.req-update-dto';
import { FriendRequestsResDto } from 'src/core/dto/friend-requests/friend-requests.res-dto';
import { FriendRequestsEntity } from 'src/core/entities/friend-request/friend-requests.entity';
import { IResponse } from 'src/core/interface/response.interface';
import { MESSAGES } from 'src/infrastructure/common/enum.ts/messages';

@Injectable()
export class FriendRequestsUsecase {
  constructor(
    private readonly databaseService: IDataServices,
    private readonly convertor: FriendRequestsConvertor,
  ) {}

  async create(
    userId: number,
    dto: FriendRequestsReqDto,
  ): Promise<IResponse<FriendRequestsResDto>> {
    try {
      const friendRequestsEntity: FriendRequestsEntity =
        this.convertor.toFriendRequestsModelFromDto(userId, dto);
      const entity: FriendRequestsEntity =
        await this.databaseService.friendRequests.create(friendRequestsEntity);
      const data: FriendRequestsResDto =
        this.convertor.toFriendRequestsResDtoFromEntity(entity);
      return {
        data,
        message: MESSAGES.FRIEND_REQUEST.CREATE.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAll(userId: number): Promise<IResponse<FriendRequestsResDto[]>> {
    try {
      const entities: FriendRequestsEntity[] =
        await this.databaseService.friendRequests.getAllByProperties({
          senderId: userId,
        });
      const data: FriendRequestsResDto[] =
        this.convertor.toFriendRequestsResDtoFromEntities(entities);
      return {
        data,
        message: MESSAGES.FRIEND_REQUEST.GET.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(
    requestId: number,
    dto: UpdateFriendRequestsReqDto,
  ): Promise<IResponse<FriendRequestsResDto>> {
    try {
      const friendRequestsEntity: FriendRequestsEntity =
        this.convertor.toUpdateFriendRequestsModelFromDto(dto);
      await this.databaseService.friendRequests.update(
        requestId,
        friendRequestsEntity,
      );
      return {
        data: null,
        message: MESSAGES.FRIEND_REQUEST.UPDATE.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(requestId: number): Promise<IResponse<null>> {
    try {
      await this.databaseService.friendRequests.delete(requestId);
      return {
        data: null,
        message: MESSAGES.FRIEND_REQUEST.DELETE.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async getOne(requestId: number): Promise<IResponse<FriendRequestsResDto>> {
    try {
      const entity: FriendRequestsEntity =
        await this.databaseService.friendRequests.get({
          request_id: requestId,
        });
      const data: FriendRequestsResDto =
        this.convertor.toFriendRequestsResDtoFromEntity(entity);
      return {
        data,
        message: MESSAGES.FRIEND_REQUEST.GET.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }
}
