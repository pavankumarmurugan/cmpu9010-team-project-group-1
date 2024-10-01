import { UserEntity } from '../entities/user/user.entity';
import { IGenericRepository } from './generic-repository.abstract';

export abstract class IDataServices {
  abstract users: IGenericRepository<UserEntity>;
}
