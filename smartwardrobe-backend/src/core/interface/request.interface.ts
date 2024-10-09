import { UserEntity } from '../entities/user/user.entity';

export type RequestWithUser = Request & { user: UserEntity };
