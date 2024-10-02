import { Injectable } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
import { UserDtoConvertor } from 'src/core/convertors/user/user-dto.convertor';
import { UserEntity } from 'src/core/entities/user/user.entity';

@Injectable()
export class LogoutUsecase {
  constructor(
    private userDtoConvertor: UserDtoConvertor,
    private databaseService: IDataServices,
  ) {}
  async logout(userId: number): Promise<string[]> {
    const updateEntity: UserEntity =
      this.userDtoConvertor.toUserLoginEntityForUpdateRefreshToken(null);
    return await this.databaseService.users.update(userId, updateEntity);
  }
}
