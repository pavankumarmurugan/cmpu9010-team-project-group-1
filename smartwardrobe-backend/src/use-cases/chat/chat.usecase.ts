import { Injectable } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
import { ChatConvertor } from 'src/core/convertors/chat/chat.convertor';
import { ChatReqDto } from 'src/core/dto/chat/chat.req-dto';
import { UpdateChatReqDto } from 'src/core/dto/chat/chat.req-update-dto';
import { ChatResDto } from 'src/core/dto/chat/chat.res-dto';
import { ChatEntity } from 'src/core/entities/chat/chat.entity';
import { IResponse } from 'src/core/interface/response.interface';
import { MESSAGES } from 'src/infrastructure/common/enum.ts/messages';
import { FirebaseService } from 'src/infrastructure/services/firebase/firebase.service';

@Injectable()
export class ChatUsecase {
  constructor(
    private databaseService: IDataServices,
    private convertor: ChatConvertor,
    private firebaseService: FirebaseService,
  ) {}

  async create(
    userId: number,
    dto: ChatReqDto,
  ): Promise<IResponse<ChatResDto>> {
    try {
      const entity: ChatEntity = this.convertor.toChatModelFromDto(userId, dto);
      const chatEntity: ChatEntity =
        await this.databaseService.chat.create(entity);

      if (chatEntity.receiverId) {
        const receiverToken = await this.firebaseService.getFcmToken(
          chatEntity.receiverId,
        );

        await this.firebaseService.addChatNotification(
          userId,
          chatEntity.receiverId,
          chatEntity.id,
          this.createMessagePreview(chatEntity.message),
        );

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

          // await this.firebaseService.addNotification(chatEntity.receiverId, {
          //   type: 'chat',
          //   content: this.createMessagePreview(chatEntity.message),
          //   sender_id: userId,
          //   chat_id: chatEntity.id,
          //   status: 'unread',
          //   timestamp: new Date().getTime(),
          // });
        }
      }

      const data: ChatResDto =
        this.convertor.toChatResDtoFromEntity(chatEntity);
      return {
        data,
        message: MESSAGES.CHATS.CREATE.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  private createMessagePreview(message: string): string {
    const maxLength = 50;
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength - 3) + '...';
  }

  // async markAsRead(userId: number, chatId: number): Promise<IResponse<null>> {
  //   try {
  //     await this.databaseService.chat.update(chatId, { status: 'read' });

  //     await this.firebaseService.updateNotificationStatus(
  //       userId,
  //       chatId,
  //       'read',
  //     );

  //     return {
  //       data: null,
  //       message: MESSAGES.CHATS.UPDATE.SUCCESS,
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async getAll(userId: number): Promise<IResponse<ChatResDto[]>> {
    try {
      const entities: ChatEntity[] =
        await this.databaseService.chat.getAllByProperties({
          senderId: userId,
        });
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
