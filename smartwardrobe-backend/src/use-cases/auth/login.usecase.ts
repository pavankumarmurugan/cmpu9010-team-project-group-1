import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
import { AuthDtoConvertor } from 'src/core/convertors/auth/auth-dto.convertor';

import { AuthLoginReqDto } from 'src/core/dto/auth/auth-req-dto.class';
import { AuthLoginResDto } from 'src/core/dto/auth/auth-res-dto.class';
import { UserEntity } from 'src/core/entities/user/user.entity';
import { IResponse } from 'src/core/interface/response.interface';
import { MESSAGES } from 'src/infrastructure/common/enum.ts/messages';
import { BcryptService } from 'src/infrastructure/frameworks/bcrypt/bcrypt.service';
import { JWTDataService } from 'src/infrastructure/frameworks/jwt/jwt.data-service';

@Injectable()
export class LoginUsecase {
  constructor(
    private databaseService: IDataServices,
    private jwtDataService: JWTDataService,
    private bcryptService: BcryptService,
    private authDtoConvertor: AuthDtoConvertor,
  ) {}

  async login(
    authLoginReqDto: AuthLoginReqDto,
  ): Promise<IResponse<AuthLoginResDto>> {
    try {
      const { username, password } = authLoginReqDto;

      const userEntity: UserEntity = await this.databaseService.users.get({
        username,
      });

      if (userEntity === null)
        throw new NotFoundException(MESSAGES.USER.USER_NOT_FOUND);

      const token = await this.jwtDataService.generateToken(
        userEntity.userId,
        userEntity.role,
      );

      const isEqualPassword: boolean = await this.bcryptService.compare(
        password,
        userEntity.password,
      );

      if (!isEqualPassword) {
        throw new UnauthorizedException(MESSAGES.USER.PASSWORD_NOT_MATCH);
      }

      const refreshToken = await this.jwtDataService.generateRefreshToken(
        userEntity.userId,
      );

      const data: AuthLoginResDto =
        this.authDtoConvertor.toAuthLoginResDtoFromUserEntity(
          userEntity,
          token,
          refreshToken,
        );
      return {
        data,
        message: MESSAGES.LOGIN.SUCCESS,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async verifyToken(): Promise<IResponse<null>> {
    return {
      data: null,
      message: MESSAGES.TOKEN.SUCCESS,
    };
  }
  catch(error) {
    throw new InternalServerErrorException(error);
  }
}
