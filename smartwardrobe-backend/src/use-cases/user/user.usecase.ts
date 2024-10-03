import { Injectable } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
import { UserDtoConvertor } from 'src/core/convertors/user/user-dto.convertor';
import { UpdatePasswordUserReqDTO } from 'src/core/dto/user/user-req-update-profile-password.dto';
import { UpdateProfileUserReqDTO } from 'src/core/dto/user/user-req-update-profile.dto';
import { UserReqDTO } from 'src/core/dto/user/user-req.dto';
import { UserResDTO } from 'src/core/dto/user/user-res.dto';
import { UserEntity } from 'src/core/entities/user/user.entity';
import { IResponse } from 'src/core/interface/response.interface';
import { MESSAGES } from 'src/infrastructure/common/enum.ts/messages';
import { BcryptService } from 'src/infrastructure/frameworks/bcrypt/bcrypt.service';
import { JWTDataService } from 'src/infrastructure/frameworks/jwt/jwt.dataservice';

@Injectable()
export class UserUsecase {
  constructor(
    private databaseService: IDataServices,
    private jwtDataService: JWTDataService,
    private userDtoConvertor: UserDtoConvertor,
    private bcryptService: BcryptService,
  ) {}

  async getAllUsers(): Promise<IResponse<UserResDTO[]>> {
    try {
      const userLoginInfoEntities: UserEntity[] =
        await this.databaseService.users.getAll();
      const data: UserResDTO[] = this.userDtoConvertor.toUserResDTOFromEntity(
        userLoginInfoEntities,
      );
      return {
        data,
        message: MESSAGES.USER.GET_ALL.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async create(userReqDTO: UserReqDTO): Promise<IResponse<UserResDTO>> {
    const hashPassword: string = await this.bcryptService.hash(
      userReqDTO.password,
    );
    const entity: UserEntity = this.userDtoConvertor.toEntityFromUserReqDTO(
      userReqDTO,
      hashPassword,
    );

    const userLoginInfoEntity: UserEntity =
      await this.databaseService.users.create(entity);

    const token = await this.jwtDataService.generateToken(
      userLoginInfoEntity.userId,
      userLoginInfoEntity.role,
    );

    const refreshToken = await this.jwtDataService.generateRefreshToken(
      userLoginInfoEntity.userId,
    );

    const data: UserResDTO =
      this.userDtoConvertor.toUserLoginInfoResDTOForCreate(
        userLoginInfoEntity,
        token,
        refreshToken,
      );

    return {
      data,
      message: MESSAGES.USER.CREATE.SUCCESS,
    };
  }

  async update(
    userId: number,
    updateProfileUserReqDTO: UpdateProfileUserReqDTO,
  ): Promise<IResponse<null>> {
    try {
      const userEntity: UserEntity =
        this.userDtoConvertor.toUpdateUserEntityFromDto(
          updateProfileUserReqDTO,
        );

      await this.databaseService.users.update(userId, userEntity);

      return {
        data: null,
        message: MESSAGES.USER.UPDATE.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(userId: number): Promise<IResponse<UserResDTO>> {
    try {
      await this.databaseService.users.delete(userId);
      return {
        data: null,
        message: MESSAGES.USER.DELETE.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async getOneUser(userId: number): Promise<IResponse<UserResDTO>> {
    try {
      const userEntity: UserEntity =
        await this.databaseService.users.get<UserEntity>({
          userId,
        });
      const data: UserResDTO =
        this.userDtoConvertor.toUserResDTOFromGetMyProfile(userEntity);
      return {
        data,
        message: MESSAGES.USER.GET.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async getMyProfile(userId: number): Promise<IResponse<UserResDTO>> {
    try {
      const userEntity: UserEntity =
        await this.databaseService.users.get<UserEntity>({
          userId,
        });
      const data: UserResDTO =
        this.userDtoConvertor.toUserLoginInfoResDTOFromGetMyProfile(userEntity);
      return {
        data,
        message: MESSAGES.USER.GET.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(
    userId: number,
    dto: UpdatePasswordUserReqDTO,
  ): Promise<IResponse<null>> {
    try {
      const { password } = dto;
      const hashPassword: string = await this.bcryptService.hash(password);

      const userLoginInfoEntity: UserEntity =
        this.userDtoConvertor.toUpdateUserEntityFromUpdatePasswordDto(
          hashPassword,
        );

      await this.databaseService.users.update(userId, userLoginInfoEntity);

      return {
        data: null,
        message: MESSAGES.USER.UPDATE.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }
}
