import { ForbiddenException, Injectable } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
import { UserDtoConvertor } from 'src/core/convertors/user/user-dto.convertor';
import { RefreshTokenResDto } from 'src/core/dto/auth/refresh-token-dto.class';
import { UserEntity } from 'src/core/entities/user/user.entity';
import { IResponse } from 'src/core/interface/response.interface';
import { MESSAGES } from 'src/infrastructure/common/enum.ts/messages';
import { BcryptService } from 'src/infrastructure/frameworks/bcrypt/bcrypt.service';
import { JWTDataService } from 'src/infrastructure/frameworks/jwt/jwt.dataservice';

@Injectable()
export class RefreshTokenUsecase {
  /**
   *
   */
  constructor(
    private userDtoConvertor: UserDtoConvertor,
    private databaseService: IDataServices,
    private bcryptService: BcryptService,
    private jwtDataService: JWTDataService,
  ) {}

  async refreshToken(
    id: number,
    rToken: string,
  ): Promise<IResponse<RefreshTokenResDto>> {
    const userEntity: UserEntity =
      await this.databaseService.users.get<UserEntity>({
        userId: id,
      });

    const isEqualRefreshToken = await this.bcryptService.compare(
      rToken,
      userEntity.refreshToken ?? '',
    );

    if (!isEqualRefreshToken) throw new ForbiddenException('Access Denied');

    const token = await this.jwtDataService.generateToken(
      userEntity.userId,
      userEntity.role,
    );

    const refreshToken = await this.jwtDataService.generateRefreshToken(
      userEntity.userId,
    );

    const data: RefreshTokenResDto =
      this.userDtoConvertor.toRefreshTokenResDtoFromRefreshToken(
        token,
        refreshToken,
      );
    return {
      data,
      message: MESSAGES.REFRESH_TOKEN.SUCCESS,
    };
  }
}
