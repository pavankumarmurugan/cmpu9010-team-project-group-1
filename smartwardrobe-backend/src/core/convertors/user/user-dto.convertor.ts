import { Injectable } from '@nestjs/common';
import { UserResDTO } from 'src/core/dto/user/user-res.dto';
import { UserEntity } from 'src/core/entities/user/user.entity';

@Injectable()
export class UserDtoConvertor {
  toUserResDTOFromEntity(entities: UserEntity[]): UserResDTO[] {
    return entities.map(({ firstname, lastname, username, userId, role }) => ({
      firstname,
      lastname,
      username,
      userId,
      role,
    }));
  }
}
