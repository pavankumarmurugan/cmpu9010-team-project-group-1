import { BaseEntity } from '../base/base.entity';

export class UserEntity extends BaseEntity {
  userId?: number;
  username?: string;
  firstname?: string;
  lastname?: string;
  password?: string;
  accessToken?: string;
  refreshToken?: string;
  role?: string;
  email?: string;
  dob?: string;
}
