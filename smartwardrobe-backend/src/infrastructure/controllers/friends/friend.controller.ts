import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FriendsReqDto } from 'src/core/dto/friends/friends.req-dto';
import { FriendsResDto } from 'src/core/dto/friends/friends.res-dto';
import { UserResDTO } from 'src/core/dto/user/user-res.dto';
import { RequestWithUser } from 'src/core/interface/request.interface';
import { IResponse } from 'src/core/interface/response.interface';
import { ROLES } from 'src/infrastructure/common/enum.ts/roles.enum';
import { Roles } from 'src/infrastructure/decorators/roles.decorator';
import { AccessTokenGuard } from 'src/infrastructure/guards/auth/accessToken.guard';
import { RolesGuard } from 'src/infrastructure/guards/roles/roles.guard';
import { FriendsUsecase } from 'src/use-cases/friends/friends.usecase';

@Controller('friends')
@ApiTags('Friends')
@UseGuards(AccessTokenGuard, RolesGuard)
@Roles(ROLES.ADMIN, ROLES.USER)
export class FriendsController {
  constructor(private readonly usecase: FriendsUsecase) {}

  // @Post('create')
  // @ApiBearerAuth()
  // @Roles(ROLES.ADMIN, ROLES.USER)
  // async create(@Body() dto: FriendsReqDto): Promise<IResponse<FriendsResDto>> {
  //   try {
  //     return await this.usecase.create(dto);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  @Get('get-all-my-friends')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN, ROLES.USER)
  async getAll(
    @Request() request: RequestWithUser,
  ): Promise<IResponse<UserResDTO[]>> {
    try {
      const {
        user: { userId },
      } = request;
      return await this.usecase.getAll(userId);
    } catch (error) {
      throw error;
    }
  }

  @Delete('delete/:id')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN, ROLES.USER)
  async delete(
    @Param('id', ParseIntPipe) friendId: number,
    @Request() request: RequestWithUser,
  ): Promise<IResponse<null>> {
    try {
      const {
        user: { userId },
      } = request;

      return await this.usecase.delete(userId, friendId);
    } catch (error) {
      throw error;
    }
  }
}
