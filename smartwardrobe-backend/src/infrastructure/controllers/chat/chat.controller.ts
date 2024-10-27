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
import { ChatGateway } from './chat.gateway';

@Controller('chat')
@ApiTags('Chat')
@UseGuards(AccessTokenGuard, RolesGuard)
export class ChatController {
  constructor(private usecase: ChatUsecase, private chatGateway: ChatGateway) {}

  @Get('get-all-my-chats')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN, ROLES.USER)
  async getAll(
    @Request() request: RequestWithUser,
  ): Promise<IResponse<ChatResDto[]>> {
    try {
      const {
        user: { userId },
      } = request;
      return await this.usecase.getAll(userId);
    } catch (error) {
      throw error;
    }
  }

  @Post('create')
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
      this.chatGateway.server.emit('message_created', response.data);
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
}
