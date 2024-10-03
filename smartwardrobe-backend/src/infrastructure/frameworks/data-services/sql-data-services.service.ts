import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IDataServices, IGenericRepository } from 'src/core/abstracts';
import { UserEntity } from 'src/core/entities/user/user.entity';
import { UserModel } from './model/user.model';
import { Repository } from 'typeorm';
import { SQLGenericRepository } from './sql-generic-repository';

@Injectable()
export class SQLDataService implements IDataServices, OnApplicationBootstrap {
  users: IGenericRepository<UserEntity>;

  constructor(
    @InjectRepository(UserModel)
    private usersRepository: Repository<UserEntity>,
  ) {}

  onApplicationBootstrap() {
    this.users = new SQLGenericRepository<UserModel>(this.usersRepository);
  }
}
