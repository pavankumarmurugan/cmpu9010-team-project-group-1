import { Injectable } from '@nestjs/common';
import { ChatReqDto } from 'src/core/dto/chat/chat.req-dto';
import { UpdateChatReqDto } from 'src/core/dto/chat/chat.req-update-dto';
import { ChatResDto } from 'src/core/dto/chat/chat.res-dto';
import { ChatEntity } from 'src/core/entities/chat/chat.entity';

@Injectable()
export class ChatConvertor {
  toChatResDtoFromEntity(entity: ChatEntity): ChatResDto {
    return { ...entity };
  }

  toChatResDtoFromEntities(entity: ChatEntity[]): ChatResDto[] {
    return entity.map((item) => ({ ...item }));
  }

  toChatModelFromDto(userId: number, dto: ChatReqDto): ChatEntity {
    return {
      ...dto,
      senderId: userId,
    };
  }

  toChatChatModelFromDto(dto: UpdateChatReqDto): ChatEntity {
    return {
      ...dto,
      id: undefined,
      updatedAt: new Date(),
    };
  }
}
