import {
  Request,
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  UseInterceptors,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthLoginReqDto } from 'src/core/dto/auth/auth-req-dto.class';
import { AuthLoginResDto } from 'src/core/dto/auth/auth-res-dto.class';
import { RefreshTokenResDto } from 'src/core/dto/auth/refresh-token-dto.class';
import { RequestWithUser } from 'src/core/interface/request.interface';
import { IResponse } from 'src/core/interface/response.interface';
import { AccessTokenGuard } from 'src/domain/guards/auth/accessToken.guard';
import { RefreshTokenGuard } from 'src/domain/guards/auth/refreshToken.guard';
import { MESSAGES } from 'src/infrastructure/common/enum.ts/messages';
import { RefreshTokenUpdateInterceptor } from 'src/infrastructure/interceptors/refresh-token-update.interceptor';
import { LoginUsecase } from 'src/use-cases/auth/login.usecase';
import { LogoutUsecase } from 'src/use-cases/auth/logout.usecase';
import { RefreshTokenUsecase } from 'src/use-cases/auth/refresh-token.usecase';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private loginUsecase: LoginUsecase,
    private logoutUsecase: LogoutUsecase,
    private refreshTokenUsecase: RefreshTokenUsecase,
  ) {}

  @Post('login')
  async login(
    @Body() authLoginReqDto: AuthLoginReqDto,
  ): Promise<IResponse<AuthLoginResDto>> {
    return await this.loginUsecase.login(authLoginReqDto);
  }

  @Get('verify-token')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  async verifyToken(): Promise<IResponse<AuthLoginResDto>> {
    return await this.loginUsecase.verifyToken();
  }

  @Post('logout')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  async logout(@Request() request: RequestWithUser): Promise<IResponse<null>> {
    try {
      const {
        user: { userId },
      } = request;
      await this.logoutUsecase.logout(userId);
      return {
        data: null,
        message: MESSAGES.LOGOUT.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('refresh')
  @ApiBearerAuth()
  @UseGuards(RefreshTokenGuard)
  @UseInterceptors(RefreshTokenUpdateInterceptor)
  refreshToken(
    @Request() request: RequestWithUser,
  ): Promise<IResponse<RefreshTokenResDto>> {
    try {
      const {
        user: { userId, refreshToken },
      } = request;
      return this.refreshTokenUsecase.refreshToken(userId, refreshToken);
    } catch (error) {
      throw error;
    }
  }
}
