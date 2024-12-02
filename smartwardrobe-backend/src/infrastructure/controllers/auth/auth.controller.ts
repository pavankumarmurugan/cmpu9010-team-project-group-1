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
import { AccessTokenGuard } from 'src/infrastructure/guards/auth/accessToken.guard';
import { RefreshTokenGuard } from 'src/infrastructure/guards/auth/refreshToken.guard';
import { MESSAGES } from 'src/infrastructure/common/enum.ts/messages';
import { RefreshTokenUpdateInterceptor } from 'src/infrastructure/interceptors/refresh-token-update.interceptor';
import { LoginUsecase } from 'src/use-cases/auth/login.usecase';
import { LogoutUsecase } from 'src/use-cases/auth/logout.usecase';
import { RefreshTokenUsecase } from 'src/use-cases/auth/refresh-token.usecase';
import { FCMReqDto } from 'src/core/dto/auth/fcm-token-dto.class';
import { ForgotPasswordReqDto } from 'src/core/dto/auth/forgot-password-dto.class';
import { ForgotPasswordUsecase } from 'src/use-cases/auth/forgot-password.usecase';
import { ForgotUpdatePasswordReqDto } from 'src/core/dto/auth/forgot-password-update.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private loginUsecase: LoginUsecase,
    private logoutUsecase: LogoutUsecase,
    private refreshTokenUsecase: RefreshTokenUsecase,
    private forgotPasswordUsecase: ForgotPasswordUsecase,
  ) {}

  @Post('login')
  @UseInterceptors(RefreshTokenUpdateInterceptor)
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

  @Post('save-fcm-token')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  async saveFcmToken(
    @Request() request: RequestWithUser,
    @Body() fcm: FCMReqDto,
  ): Promise<IResponse<null>> {
    try {
      const {
        user: { userId },
      } = request;

      const { token } = fcm;
      return await this.loginUsecase.saveFcmToken(userId, token);
    } catch (error) {
      throw error;
    }
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordReqDto: ForgotPasswordReqDto,
  ): Promise<IResponse<null>> {
    try {
      return this.forgotPasswordUsecase.sendOtp(forgotPasswordReqDto);
    } catch (error) {
      throw error;
    }
  }

  @Post('update-password')
  async updatePassword(
    @Body() dto: ForgotUpdatePasswordReqDto,
  ): Promise<IResponse<null>> {
    try {
      return this.forgotPasswordUsecase.updatePassword(dto);
    } catch (error) {
      throw error;
    }
  }
}
