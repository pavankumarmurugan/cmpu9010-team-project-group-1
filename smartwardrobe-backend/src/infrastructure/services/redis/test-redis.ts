import { Injectable } from '@nestjs/common';
import { RedisCacheService } from 'src/infrastructure/services/redis/redis-cache.service';

@Injectable()
export class TestService {
  constructor(private readonly redisCacheService: RedisCacheService) {}

  async setRedisValue(key: string, value: string, ttl: number): Promise<void> {
    await this.redisCacheService.set(key, value);
    console.log(`Key "${key}" set with value "${value}" for ${ttl} seconds.`);
  }

  async getRedisValue(key: string): Promise<string | null> {
    const value = await this.redisCacheService.get<string>(key);
    console.log(`Retrieved value for key "${key}":`, value);
    return value;
  }

  async deleteRedisValue(key: string): Promise<void> {
    await this.redisCacheService.del(key);
    console.log(`Key "${key}" deleted from Redis.`);
  }
}
