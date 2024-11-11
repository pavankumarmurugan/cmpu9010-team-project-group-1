import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserLikedModelRequestDTO } from 'src/core/dto/user-liked-models/user-liked-models-req.dto';
import { UserLikedModelResponseDTO } from 'src/core/dto/user-liked-models/user-liked-models-res.dto';
import { IResponse } from 'src/core/interface/response.interface';
import { AccessTokenGuard } from 'src/infrastructure/guards/auth/accessToken.guard';
import { Roles } from 'src/infrastructure/decorators/roles.decorator';
import { RolesGuard } from 'src/infrastructure/guards/roles/roles.guard';
import { RequestWithUser } from 'src/core/interface/request.interface';
import { ROLES } from 'src/infrastructure/common/enum.ts/roles.enum';
import { UserLikedModelUsecase } from 'src/use-cases/user-liked-models/user-liked-models.usecase';

@Controller('user-liked-models')
@ApiTags('UserLikedModels')
export class UserLikedModelController {
  constructor(private readonly userLikedModelUsecase: UserLikedModelUsecase) {}

  @Post('create')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(ROLES.USER, ROLES.ADMIN)
  async createLikedModel(
    @Request() request: RequestWithUser,
    @Body() dto: UserLikedModelRequestDTO,
  ): Promise<IResponse<UserLikedModelResponseDTO>> {
    try {
      const {
        user: { userId },
      } = request;
      return await this.userLikedModelUsecase.create(userId, dto);
    } catch (error) {
      throw error;
    }
  }

  @Get('user-liked-models')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(ROLES.USER, ROLES.ADMIN)
  async getLikedModelsByUserId(
    @Request() request: RequestWithUser,
  ): Promise<IResponse<UserLikedModelResponseDTO[]>> {
    try {
      const {
        user: { userId },
      } = request;
      return await this.userLikedModelUsecase.getAllByUserId(userId);
    } catch (error) {
      throw error;
    }
  }

  @Delete('delete/:id')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(ROLES.USER, ROLES.ADMIN)
  async deleteLikedModel(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IResponse<null>> {
    try {
      return await this.userLikedModelUsecase.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
