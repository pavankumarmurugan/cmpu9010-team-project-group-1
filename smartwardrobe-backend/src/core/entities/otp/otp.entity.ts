import { BaseEntity } from '../base/base.entity';

export class OtpEntity extends BaseEntity {
  id?: number;
  email?: string;
  otp?: string;
  expiresAt?: Date;
}
