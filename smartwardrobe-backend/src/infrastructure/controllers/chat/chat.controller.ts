import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChatGroupReqDto } from 'src/core/dto/chat/chat.group.req-dto';
import { ChatGroupResDto } from 'src/core/dto/chat/chat.group.res-dto';
import { ChatReqDto } from 'src/core/dto/chat/chat.req-dto';
import { UpdateChatReqDto } from 'src/core/dto/chat/chat.req-update-dto';
import { ChatResDto } from 'src/core/dto/chat/chat.res-dto';

import { RequestWithUser } from 'src/core/interface/request.interface';
import { IResponse } from 'src/core/interface/response.interface';
import { ROLES } from 'src/infrastructure/common/enum.ts/roles.enum';
import { Roles } from 'src/infrastructure/decorators/roles.decorator';
import { AccessTokenGuard } from 'src/infrastructure/guards/auth/accessToken.guard';
import { RolesGuard } from 'src/infrastructure/guards/roles/roles.guard';
import { ChatUsecase } from 'src/use-cases/chat/chat.usecase';

@Controller('chat')
@ApiTags('Chat')
@UseGuards(AccessTokenGuard, RolesGuard)
export class ChatController {
  constructor(private usecase: ChatUsecase) {}

  // @Get('get-all-my-chats')
  // @ApiBearerAuth()
  // @Roles(ROLES.ADMIN, ROLES.USER)
  // async getAll(
  //   @Request() request: RequestWithUser,
  // ): Promise<IResponse<ChatResDto[]>> {
  //   try {
  //     const {
  //       user: { userId },
  //     } = request;
  //     return await this.usecase.getAll(userId);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  @Get('get-all-my-chats-by-friend-id/:friendId')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN, ROLES.USER)
  async getAll(
    @Param('friendId', ParseIntPipe) friendId: number,
    @Request() request: RequestWithUser,
  ): Promise<IResponse<ChatResDto[]>> {
    try {
      const {
        user: { userId },
      } = request;
      return await this.usecase.getAllMyChatByFriendId(userId, friendId);
    } catch (error) {
      throw error;
    }
  }

  @Get('get-all-my-chats-by-group-id/:groupId')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN, ROLES.USER)
  async getAllByGroupId(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Request() request: RequestWithUser,
  ): Promise<IResponse<ChatGroupResDto[]>> {
    try {
      const {
        user: { userId },
      } = request;

      return await this.usecase.getAllMyChatByByGroupId(groupId, userId);
    } catch (error) {
      throw error;
    }
  }

  @Post('create/send-message-to-friend')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN, ROLES.USER)
  async create(
    @Request() request: RequestWithUser,
    @Body() dto: ChatReqDto,
  ): Promise<IResponse<ChatResDto>> {
    try {
      const {
        user: { userId },
      } = request;
      const response = await this.usecase.create(userId, dto);
      return response;
    } catch (error) {
      throw error;
    }
  }

  @Post('create/send-message-to-group')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN, ROLES.USER)
  async createSendMessageToGroup(
    @Request() request: RequestWithUser,
    @Body() dto: ChatGroupReqDto,
  ): Promise<IResponse<ChatGroupResDto>> {
    try {
      const {
        user: { userId },
      } = request;
      const response = await this.usecase.createSendMessageToGroup(userId, dto);
      return response;
    } catch (error) {
      throw error;
    }
  }

  @Patch('update')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN, ROLES.USER)
  async update(@Body() dto: UpdateChatReqDto): Promise<IResponse<ChatResDto>> {
    try {
      return await this.usecase.update(dto);
    } catch (error) {
      throw error;
    }
  }

  @Delete('delete/:id')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN, ROLES.USER)
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IResponse<ChatResDto>> {
    try {
      return await this.usecase.delete(id);
    } catch (error) {
      throw error;
    }
  }

  @Get('get-one/:id')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN, ROLES.USER)
  async getOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IResponse<ChatResDto>> {
    try {
      return await this.usecase.getOne(id);
    } catch (error) {
      throw error;
    }
  }

  //TODO -
  // Get all my chats
  // Get all chats for one user
  // Get all chats for one group
  // should not be able to add frineds to a group chat if already in a group chat
}
