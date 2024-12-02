import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModel } from './base.model';

@Entity('otp')
export class OTPModel extends BaseModel {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  readonly id?: number;

  @Column({ type: 'varchar', name: 'email' })
  readonly email?: string;

  @Column({ type: 'varchar', name: 'otp' })
  readonly otp?: string;

  @Column({ type: 'timestamp', name: 'created_at' })
  readonly createdAt?: Date;

  @Column({ type: 'timestamp', name: 'expires_at' })
  readonly expiresAt?: Date;
}
