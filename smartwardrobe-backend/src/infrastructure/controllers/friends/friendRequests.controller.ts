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
import { FriendRequestsReqDto } from 'src/core/dto/friend-requests/friend-requests.req-dto';
import { UpdateFriendRequestsReqDto } from 'src/core/dto/friend-requests/friend-requests.req-update-dto';
import { FriendRequestsResDto } from 'src/core/dto/friend-requests/friend-requests.res-dto';
import { RequestWithUser } from 'src/core/interface/request.interface';
import { IResponse } from 'src/core/interface/response.interface';
import { ROLES } from 'src/infrastructure/common/enum.ts/roles.enum';
import { Roles } from 'src/infrastructure/decorators/roles.decorator';
import { AccessTokenGuard } from 'src/infrastructure/guards/auth/accessToken.guard';
import { RolesGuard } from 'src/infrastructure/guards/roles/roles.guard';
import { FriendRequestsUsecase } from 'src/use-cases/friend-requests/friend-requests.usecase';

@Controller('friend-requests')
@ApiTags('Friend Requests')
@UseGuards(AccessTokenGuard, RolesGuard)
export class FriendRequestsController {
  constructor(private usecase: FriendRequestsUsecase) {}

  @Get('get-all-my-requests')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(ROLES.ADMIN, ROLES.USER)
  async getAll(
    @Request() request: RequestWithUser,
  ): Promise<IResponse<FriendRequestsResDto[]>> {
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
    @Body() dto: FriendRequestsReqDto,
  ): Promise<IResponse<FriendRequestsResDto>> {
    try {
      const {
        user: { userId },
      } = request;
      return await this.usecase.create(userId, dto);
    } catch (error) {
      throw error;
    }
  }

  @Patch('update')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN, ROLES.USER)
  async update(
    @Request() request: RequestWithUser,
    @Body() dto: UpdateFriendRequestsReqDto,
  ): Promise<IResponse<FriendRequestsResDto>> {
    try {
      const {
        user: { userId },
      } = request;
      const { requestId } = dto;
      return await this.usecase.update(requestId, dto);
    } catch (error) {
      throw error;
    }
  }

  @Delete('delete/:id')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN, ROLES.USER)
  async delete(
    @Param('id', ParseIntPipe) requestId: number,
  ): Promise<IResponse<null>> {
    try {
      return await this.usecase.delete(requestId);
    } catch (error) {
      throw error;
    }
  }

  @Get('get-one/:id')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN, ROLES.USER)
  async getOne(
    @Param('id', ParseIntPipe) requestId: number,
  ): Promise<IResponse<FriendRequestsResDto>> {
    try {
      return await this.usecase.getOne(requestId);
    } catch (error) {
      throw error;
    }
  }
}
