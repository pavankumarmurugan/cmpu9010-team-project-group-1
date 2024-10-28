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
import { LikesReqDto } from 'src/core/dto/likes/likes.req-dto';
import { UpdateLikesReqDto } from 'src/core/dto/likes/likes.req-update-dto';
import { LikesResDto } from 'src/core/dto/likes/likes.res-dto';
import { RequestWithUser } from 'src/core/interface/request.interface';
import { IResponse } from 'src/core/interface/response.interface';
import { ROLES } from 'src/infrastructure/common/enum.ts/roles.enum';
import { Roles } from 'src/infrastructure/decorators/roles.decorator';
import { AccessTokenGuard } from 'src/infrastructure/guards/auth/accessToken.guard';
import { RolesGuard } from 'src/infrastructure/guards/roles/roles.guard';
import { LikesUsecase } from 'src/use-cases/likes/likes.usecase';

@Controller('likes')
@ApiTags('Likes')
@UseGuards(AccessTokenGuard, RolesGuard)
export class LikesController {
  constructor(private usecase: LikesUsecase) {}

  @Get('get-all')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN, ROLES.USER)
  async getAll(
    @Request() request: RequestWithUser,
  ): Promise<IResponse<LikesResDto[]>> {
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
    @Body() dto: LikesReqDto,
  ): Promise<IResponse<LikesResDto>> {
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
    @Body() dto: UpdateLikesReqDto,
  ): Promise<IResponse<LikesResDto>> {
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
  ): Promise<IResponse<LikesResDto>> {
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
  ): Promise<IResponse<LikesResDto>> {
    try {
      return await this.usecase.getOne(id);
    } catch (error) {
      throw error;
    }
  }
}
