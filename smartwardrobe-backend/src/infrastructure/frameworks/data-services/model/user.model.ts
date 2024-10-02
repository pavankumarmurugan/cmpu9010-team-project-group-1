import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModel } from './base.model';

@Entity('user')
export class UserModel extends BaseModel {
  @PrimaryGeneratedColumn({ type: 'int', name: 'user_id' })
  readonly userId?: number;
  @Column({ type: 'varchar', name: 'username' })
  readonly username?: string;
  @Column({ type: 'varchar', name: 'firstname' })
  readonly firstname?: string;
  @Column({ type: 'varchar', name: 'lastname' })
  readonly lastname?: string;
  @Column({ type: 'varchar', name: 'password' })
  readonly password?: string;
  @Column({ type: 'varchar', name: 'refresh_token' })
  readonly refreshToken?: string;
  @Column({ type: 'varchar', name: 'role' })
  readonly role?: string;
  @Column({ type: 'varchar', name: 'email' })
  readonly email?: string;
  @Column({ type: 'varchar', name: 'dob' })
  readonly dob?: string;
}
