import { BadRequestException, Injectable } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
import { ChatConvertor } from 'src/core/convertors/chat/chat.convertor';
import { ChatGroupReqDto } from 'src/core/dto/chat/chat.group.req-dto';
import { ChatGroupResDto } from 'src/core/dto/chat/chat.group.res-dto';
import { ChatReqDto } from 'src/core/dto/chat/chat.req-dto';
import { UpdateChatReqDto } from 'src/core/dto/chat/chat.req-update-dto';
import { ChatResDto } from 'src/core/dto/chat/chat.res-dto';
import { ChatEntity } from 'src/core/entities/chat/chat.entity';
import { GroupMembersEntity } from 'src/core/entities/group-members/group-members.entity';
import { UserEntity } from 'src/core/entities/user/user.entity';
import { IResponse } from 'src/core/interface/response.interface';
import { MESSAGES } from 'src/infrastructure/common/enum.ts/messages';
import { SOCKET_MESSAGE_CONSTANTS } from 'src/infrastructure/common/enum.ts/socket.enum';
import { FirebaseService } from 'src/infrastructure/services/firebase/firebase.service';
import { WebSocketGatewayService } from 'src/infrastructure/services/web-sockets/friend-requests/websocket.gateway.service';

@Injectable()
export class ChatUsecase {
  constructor(
    private databaseService: IDataServices,
    private convertor: ChatConvertor,
    private firebaseService: FirebaseService,
    private websocketGateway: WebSocketGatewayService,
  ) {}

  async createSendMessageToUser(
    userId: number,
    dto: ChatReqDto,
  ): Promise<IResponse<ChatResDto>> {
    try {
      const entity: ChatEntity = this.convertor.toChatModelFromDto(userId, dto);
      const chatEntity: ChatEntity =
        await this.databaseService.chat.create(entity);

      const data: ChatResDto =
        this.convertor.toChatResDtoFromEntity(chatEntity);

      if (chatEntity.receiverId) {
        const roomId = `room_${Math.min(userId, chatEntity.receiverId)}_${Math.max(userId, chatEntity.receiverId)}`;

        this.websocketGateway.emitToChatRoom(
          roomId,
          SOCKET_MESSAGE_CONSTANTS.SEND_MESSAGE_TO_OTHER_USER,
          data,
        );

        const receiverToken = await this.firebaseService.getFcmToken(
          chatEntity.receiverId,
        );

        // await this.firebaseService.addChatNotification(
        //   userId,
        //   chatEntity.receiverId,
        //   chatEntity.id,
        //   this.createMessagePreview(chatEntity.message),
        // );

        if (receiverToken) {
          await this.firebaseService.sendBrowserNotification(
            receiverToken,
            'New Message',
            this.createMessagePreview(chatEntity.message),
            {
              type: 'chat',
              messageId: String(chatEntity.id),
              senderId: String(userId),
              clickAction: 'OPEN_CHAT',
            },
          );
        }
      }

      return {
        data,
        message: MESSAGES.CHATS.CREATE.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async createSendMessageToGroup(
    userId: number,
    dto: ChatGroupReqDto,
  ): Promise<IResponse<ChatGroupResDto>> {
    try {
      const groupMembersEntity: GroupMembersEntity =
        await this.databaseService.groupMembers.get({
          groupId: dto.groupId,
          userId,
        });

      if (groupMembersEntity) {
        const entity: ChatEntity =
          this.convertor.toChatModelFromChatGroupReqDto(userId, dto);
        const chatEntity: ChatEntity =
          await this.databaseService.chat.create(entity);

        const messageData = this.convertor.toChatResDtoFromEntity(chatEntity);

        this.websocketGateway.emitToGroup(
          dto.groupId,
          SOCKET_MESSAGE_CONSTANTS.SEND_MESSAGE_TO_GROUP,
          messageData,
        );

        if (chatEntity.receiverId) {
          const receiverToken = await this.firebaseService.getFcmToken(
            chatEntity.receiverId,
          );

          // await this.firebaseService.addChatNotification(
          //   userId,
          //   chatEntity.receiverId,
          //   chatEntity.id,
          //   this.createMessagePreview(chatEntity.message),
          // );

          if (receiverToken) {
            await this.firebaseService.sendBrowserNotification(
              receiverToken,
              'New Message',
              this.createMessagePreview(chatEntity.message),
              {
                type: 'chat',
                messageId: String(chatEntity.id),
                senderId: String(userId),
                clickAction: 'OPEN_CHAT',
              },
            );
          }
        }

        const data: ChatResDto =
          this.convertor.toChatResDtoFromEntity(chatEntity);
        return {
          data,
          message: MESSAGES.CHATS.CREATE.SUCCESS,
        };
      }
      throw new BadRequestException(MESSAGES.GROUP.NOT_A_MEMBER);
    } catch (error) {
      throw error;
    }
  }

  private createMessagePreview(message: string): string {
    const maxLength = 50;
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength - 3) + '...';
  }

  async getAllMyChatByFriendId(
    userId: number,
    friendId: number,
  ): Promise<IResponse<ChatResDto[]>> {
    try {
      const entities: ChatEntity[] = (
        await Promise.all([
          this.databaseService.chat.getAllByProperties({
            receiverId: userId,
            senderId: friendId,
          }),
          this.databaseService.chat.getAllByProperties({
            receiverId: friendId,
            senderId: userId,
          }),
        ])
      ).flat();
      const data: ChatResDto[] =
        this.convertor.toChatResDtoFromEntities(entities);
      return {
        data,
        message: MESSAGES.CHATS.GET.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAllMyChatByByGroupId(
    groupId: number,
    userId: number,
  ): Promise<IResponse<ChatGroupResDto[]>> {
    const groupMembersEntity: GroupMembersEntity =
      await this.databaseService.groupMembers.get({ groupId, userId });
    if (groupMembersEntity) {
      const entities: ChatEntity[] =
        await this.databaseService.chat.getAllByProperties({ groupId });

      const senders = entities.map(({ senderId }) => senderId);

      const users: UserEntity[] =
        await this.databaseService.users.getAllByIdsIn(senders, 'userId');

      const data: ChatGroupResDto[] =
        this.convertor.toChatGroupResDtoFromEntities(users, entities);
      return {
        data,
        message: MESSAGES.CHATS.GET.SUCCESS,
      };
    }
    throw new BadRequestException(MESSAGES.GROUP.NOT_A_MEMBER);
  }

  async update(dto: UpdateChatReqDto): Promise<IResponse<ChatResDto>> {
    try {
      const { id } = dto;
      const chatEntity: ChatEntity = this.convertor.toChatChatModelFromDto(dto);
      await this.databaseService.chat.update(id, chatEntity);
      return {
        data: null,
        message: MESSAGES.CHATS.UPDATE.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number): Promise<IResponse<null>> {
    try {
      await this.databaseService.chat.delete(id);
      return {
        data: null,
        message: MESSAGES.CHATS.DELETE.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async getOne(id: number): Promise<IResponse<ChatResDto>> {
    try {
      const data: ChatEntity = await this.databaseService.chat.get({ id });
      return {
        data,
        message: MESSAGES.CHATS.GET.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }
}
