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
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { UpdatePasswordUserReqDTO } from 'src/core/dto/user/user-req-update-profile-password.dto';
import { UpdateProfileUserReqDTO } from 'src/core/dto/user/user-req-update-profile.dto';
import { UserReqDTO } from 'src/core/dto/user/user-req.dto';
import { RequestWithUser } from 'src/core/interface/request.interface';
import { Roles } from 'src/infrastructure/decorators/roles.decorator';
import { AccessTokenGuard } from 'src/infrastructure/guards/auth/accessToken.guard';
import { RolesGuard } from 'src/infrastructure/guards/roles/roles.guard';
import { ROLES } from 'src/infrastructure/common/enum.ts/roles.enum';
import { RefreshTokenUpdateInterceptor } from 'src/infrastructure/interceptors/refresh-token-update.interceptor';
import { UserUsecase } from 'src/use-cases/user/user.usecase';
import { CartCreateInterceptor } from 'src/infrastructure/interceptors/cart-add.interceptor';

@Controller('users')
@ApiTags('User')
export class UserController {
  constructor(private userUsecase: UserUsecase) {}

  @Get('get-all')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  @Throttle(3, 60)
  async getAll() {
    try {
      return await this.userUsecase.getAllUsers();
    } catch (error) {
      throw error;
    }
  }

  @Post('create')
  @UseInterceptors(RefreshTokenUpdateInterceptor)
  @UseInterceptors(CartCreateInterceptor)
  async saveUser(@Body() dto: UserReqDTO) {
    try {
      return await this.userUsecase.create(dto);
    } catch (error) {
      throw error;
    }
  }

  @Patch('update')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(ROLES.USER, ROLES.ADMIN, ROLES.OWNER)
  async update(
    @Request() request: RequestWithUser,
    @Body() dto: UpdateProfileUserReqDTO,
  ) {
    try {
      const {
        user: { userId },
      } = request;
      return await this.userUsecase.update(userId, dto);
    } catch (error) {
      throw error;
    }
  }

  @Delete('delete/:id')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  async delete(@Param('id', ParseIntPipe) userId: number) {
    try {
      return await this.userUsecase.delete(userId);
    } catch (error) {
      throw error;
    }
  }

  @Get('get-my-profile')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(ROLES.USER, ROLES.ADMIN, ROLES.OWNER)
  async getMyProfile(@Request() request: RequestWithUser) {
    try {
      const {
        user: { userId },
      } = request;
      return await this.userUsecase.getMyProfile(userId);
    } catch (error) {
      throw error;
    }
  }

  @Patch('update-password')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(ROLES.USER, ROLES.ADMIN, ROLES.OWNER)
  async updatePassword(
    @Request() request: RequestWithUser,
    @Body() dto: UpdatePasswordUserReqDTO,
  ) {
    try {
      const {
        user: { userId },
      } = request;
      return await this.userUsecase.updatePassword(userId, dto);
    } catch (error) {
      throw error;
    }
  }
}
