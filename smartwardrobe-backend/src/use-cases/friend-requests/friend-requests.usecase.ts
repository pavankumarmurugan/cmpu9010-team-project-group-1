import { ConflictException, Injectable } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
import { FriendRequestsConvertor } from 'src/core/convertors/friend-requests/friend-requests.convertor';
import { UserDtoConvertor } from 'src/core/convertors/user/user-dto.convertor';
import { FriendRequestsReqDto } from 'src/core/dto/friend-requests/friend-requests.req-dto';
import { UpdateFriendRequestsReqDto } from 'src/core/dto/friend-requests/friend-requests.req-update-dto';
import { FriendRequestsResDto } from 'src/core/dto/friend-requests/friend-requests.res-dto';
import { UserResDTO } from 'src/core/dto/user/user-res.dto';
import { FriendRequestsEntity } from 'src/core/entities/friend-request/friend-requests.entity';
import { UserEntity } from 'src/core/entities/user/user.entity';
import { IResponse } from 'src/core/interface/response.interface';
import { FRIEND_REQUEST_STATUS } from 'src/infrastructure/common/enum.ts/friend-requests.enum';
import { MESSAGES } from 'src/infrastructure/common/enum.ts/messages';
import { FirebaseService } from 'src/infrastructure/services/firebase/firebase.service';

@Injectable()
export class FriendRequestsUsecase {
  constructor(
    private readonly databaseService: IDataServices,
    private readonly convertor: FriendRequestsConvertor,
    private readonly firebaseService: FirebaseService,
  ) {}

  async create(
    userId: number,
    dto: FriendRequestsReqDto,
  ): Promise<IResponse<FriendRequestsResDto>> {
    try {
      const { receiverId } = dto;
      if (userId === receiverId) {
        throw new ConflictException(MESSAGES.FRIEND_REQUEST.CREATE.SAME_USER);
      }

      const friendRequestsEntity: FriendRequestsEntity =
        this.convertor.toFriendRequestsModelFromDto(userId, dto);

      const friendRequestsEntities: FriendRequestsEntity[] =
        await this.databaseService.friendRequests.getAllByProperties({
          senderId: userId,
          receiverId: dto.receiverId,
        });

      if (friendRequestsEntities.length > 0) {
        throw new ConflictException(MESSAGES.FRIEND_REQUEST.CREATE.ALREADY);
      }
      const entity: FriendRequestsEntity =
        await this.databaseService.friendRequests.create(friendRequestsEntity);
      const data: FriendRequestsResDto =
        this.convertor.toFriendRequestsResDtoFromEntity(entity);

      await this.firebaseService.addFriendRequestNotification(
        userId,
        data.receiverId,
        data.requestId,
        'senderName',
      );

      // await this.firebaseService.addFriendRequestNotification(
      //   data.receiverId,
      //   data.requestId,
      //   {
      //     senderId: data.senderId,
      //     status: FRIEND_REQUEST_STATUS.PENDING,
      //     createdAt: new Date().toISOString(),
      //   },
      // );

      // await this.firebaseService.addNotification(data.receiverId, {
      //   type: MESSAGES.FIREBASE.TYPES.FRIEND_REQUEST,
      //   content: MESSAGES.FIREBASE.FRIEND_REQUEST.RECEIVED,
      //   senderId: data.senderId,
      //   receiverId: data.receiverId,
      //   status: 'unread',
      //   createdAt: new Date().toISOString(),
      // });

      const receiverToken = await this.firebaseService.getFcmToken(
        data.receiverId,
      );
      if (receiverToken)
        await this.firebaseService.sendBrowserNotification(
          receiverToken,
          MESSAGES.FIREBASE.FRIEND_REQUEST.RECEIVED.TITLE,
          MESSAGES.FIREBASE.FRIEND_REQUEST.RECEIVED.SUCCESS,
          {
            type: MESSAGES.FIREBASE.TYPES.FRIEND_REQUEST,
            senderId: data.senderId,
          },
        );

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
          receiverId: userId,
        });

      const pendingFriendRequests = entities.filter(
        ({ status }) => status === FRIEND_REQUEST_STATUS.PENDING,
      );

      const userIds = pendingFriendRequests.map(({ senderId }) => senderId);

      const userEntities: UserEntity[] =
        await this.databaseService.users.getAllByIdsIn(userIds, 'userId');

      const data: FriendRequestsResDto[] =
        this.convertor.toUserResDTOFromFriendRequestUsecase(
          userEntities,
          pendingFriendRequests,
        );

      return {
        data,
        message: MESSAGES.FRIEND_REQUEST.GET.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(
    userId: number,
    requestId: number,
    dto: UpdateFriendRequestsReqDto,
  ): Promise<IResponse<FriendRequestsResDto>> {
    try {
      const result: FriendRequestsEntity =
        await this.databaseService.friendRequests.get({ requestId });

      if (!result || userId !== result.receiverId) {
        throw new ConflictException(
          MESSAGES.FRIEND_REQUEST.UPDATE.NOT_AUTHORIZED,
        );
      }
      const friendRequestsEntity: FriendRequestsEntity =
        this.convertor.toUpdateFriendRequestsModelFromDto(dto);

      await this.databaseService.friendRequests.update(
        requestId,
        friendRequestsEntity,
      );

      const entity: FriendRequestsEntity =
        await this.databaseService.friendRequests.get({
          requestId: requestId,
        });

      await this.databaseService.friends.create({
        user1Id: entity.senderId,
        user2Id: entity.receiverId,
      });

      // const notificationData = {
      //   content: MESSAGES.FIREBASE.FRIEND_REQUEST.ACCEPTED,
      //   type: MESSAGES.FIREBASE.TYPES.FRIEND_REQUEST_ACCEPTED,
      //   status: 'unread',
      //   senderId: entity.senderId,
      //   receiverId: entity.receiverId,
      //   createdAt: new Date().toISOString(),
      // };

      // await this.firebaseService.addNotification(
      //   entity.receiverId,
      //   notificationData,
      // );

      await this.firebaseService.addFriendAcceptNotification(
        entity.senderId,
        entity.receiverId,
        requestId,
        'senderName',
      );

      const receiverToken = await this.firebaseService.getFcmToken(
        entity.senderId,
      );

      if (receiverToken)
        await this.firebaseService.sendBrowserNotification(
          receiverToken,
          MESSAGES.FIREBASE.FRIEND_REQUEST.RECEIVED.TITLE,
          MESSAGES.FIREBASE.FRIEND_REQUEST.RECEIVED.SUCCESS,
          {
            type: MESSAGES.FIREBASE.TYPES.FRIEND_REQUEST,
            senderId: entity.receiverId,
          },
        );

      return {
        data: null,
        message: MESSAGES.FRIEND_REQUEST.UPDATE.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(userId: number, requestId: number): Promise<IResponse<null>> {
    try {
      const { receiverId, senderId }: FriendRequestsEntity =
        await this.databaseService.friendRequests.get({ requestId });

      if (userId === receiverId || userId === senderId) {
        await this.databaseService.friendRequests.delete(requestId);
        return {
          data: null,
          message: MESSAGES.FRIEND_REQUEST.DELETE.SUCCESS,
        };
      }
      throw new ConflictException(
        MESSAGES.FRIEND_REQUEST.DELETE.NOT_AUTHORIZED,
      );
    } catch (error) {
      throw new ConflictException(MESSAGES.FRIEND_REQUEST.DELETE.NOT_FOUND);
    }
  }

  async getOne(requestId: number): Promise<IResponse<FriendRequestsResDto>> {
    try {
      const entity: FriendRequestsEntity =
        await this.databaseService.friendRequests.get({
          requestId: requestId,
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
