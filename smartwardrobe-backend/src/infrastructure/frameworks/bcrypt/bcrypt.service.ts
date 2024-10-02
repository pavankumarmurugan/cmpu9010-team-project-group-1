import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  private readonly _saltOrRounds = +process.env.SALT_OR_ROUNDS;

  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this._saltOrRounds);
    return await bcrypt.hash(password, salt);
  }

  async compare(password: string, hashPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashPassword);
  }
}
