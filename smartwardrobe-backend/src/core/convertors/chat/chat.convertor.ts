import { Injectable } from '@nestjs/common';
import { ChatGroupReqDto } from 'src/core/dto/chat/chat.group.req-dto';
import { ChatGroupResDto } from 'src/core/dto/chat/chat.group.res-dto';
import { ChatReqDto } from 'src/core/dto/chat/chat.req-dto';
import { UpdateChatReqDto } from 'src/core/dto/chat/chat.req-update-dto';
import { ChatResDto } from 'src/core/dto/chat/chat.res-dto';
import { ChatEntity } from 'src/core/entities/chat/chat.entity';
import { UserEntity } from 'src/core/entities/user/user.entity';

@Injectable()
export class ChatConvertor {
  toChatResDtoFromEntity(entity: ChatEntity): ChatResDto {
    return { ...entity };
  }

  toChatResDtoFromEntities(entity: ChatEntity[]): ChatResDto[] {
    return entity.map((item) => ({ ...item }));
  }

  toChatGroupResDtoFromEntities(
    users: UserEntity[],
    entity: ChatEntity[],
  ): ChatGroupResDto[] {
    return entity.map((item) => {
      const { firstname, lastname, username, userId, role, profilePic } =
        users.find(({ userId }) => userId === item.senderId);
      return {
        userDetails: {
          firstname,
          lastname,
          username,
          userId,
          role,
          profilePic,
        },
        ...item,
      };
    });
  }

  toChatModelFromDto(userId: number, dto: ChatReqDto): ChatEntity {
    return {
      ...dto,
      senderId: userId,
    };
  }

  toChatModelFromChatGroupReqDto(
    userId: number,
    dto: ChatGroupReqDto,
  ): ChatEntity {
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
