import { Injectable } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
import { UserDtoConvertor } from 'src/core/convertors/user/user-dto.convertor';
import { UserResDTO } from 'src/core/dto/user/user-res.dto';
import { UserEntity } from 'src/core/entities/user/user.entity';
import { IResponse } from 'src/core/interface/response.interface';
import { MESSAGES } from 'src/infrastructure/common/enum.ts/messages';
@Injectable()
export class UserUsecase {
  constructor(
    private databaseService: IDataServices,
    private userDtoConvertor: UserDtoConvertor,
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
}
