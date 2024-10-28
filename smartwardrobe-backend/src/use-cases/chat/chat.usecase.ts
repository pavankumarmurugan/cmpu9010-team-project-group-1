import { Injectable } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
import { ChatConvertor } from 'src/core/convertors/chat/chat.convertor';
import { ChatReqDto } from 'src/core/dto/chat/chat.req-dto';
import { UpdateChatReqDto } from 'src/core/dto/chat/chat.req-update-dto';
import { ChatResDto } from 'src/core/dto/chat/chat.res-dto';
import { ChatEntity } from 'src/core/entities/chat/chat.entity';
import { IResponse } from 'src/core/interface/response.interface';
import { MESSAGES } from 'src/infrastructure/common/enum.ts/messages';

@Injectable()
export class ChatUsecase {
  constructor(
    private databaseService: IDataServices,
    private convertor: ChatConvertor,
  ) {}

  async create(
    userId: number,
    dto: ChatReqDto,
  ): Promise<IResponse<ChatResDto>> {
    try {
      const entity: ChatEntity = this.convertor.toChatModelFromDto(userId, dto);
      const chatEntity: ChatEntity = await this.databaseService.chat.create(
        entity,
      );
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
