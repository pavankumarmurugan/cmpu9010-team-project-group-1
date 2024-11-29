import { Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as redisStore from 'cache-manager-ioredis';

@Injectable()
export class RedisCacheService {
  private readonly redisCacheManager: Cache;

  constructor() {
    this.redisCacheManager = redisStore.create({
      store: redisStore,
      host: process.env.REDIS_HOST, // Redis hostname
      port: 6380, // Redis port for SSL/TLS
      password: process.env.REDIS_PASSWORD, // Redis password
      tls: true, // Ensure secure connection
    });
  }

  /**
   * Get a value from Redis cache by key.
   * @param key The cache key.
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redisCacheManager.get<T>(key);
      console.log(`[RedisCacheService] GET ${key}:`, value ? 'HIT' : 'MISS');
      return value || null;
    } catch (error) {
      console.error(
        `[RedisCacheService] GET Error for key ${key}:`,
        error.message,
      );
      return null;
    }
  }

  /**
   * Set a value in Redis cache with an optional TTL.
   * @param key The cache key.
   * @param value The value to cache.
   * @param ttl Time-to-live in seconds (optional).
   */
  async set<T>(key: string, value: T, ttl: number = 0): Promise<void> {
    try {
      await this.redisCacheManager.set(key, value, ttl);
      console.log(`[RedisCacheService] SET ${key}: Success`);
    } catch (error) {
      console.error(
        `[RedisCacheService] SET Error for key ${key}:`,
        error.message,
      );
    }
  }

  /**
   * Delete a value from Redis cache by key.
   * @param key The cache key.
   */
  async del(key: string): Promise<void> {
    try {
      await this.redisCacheManager.del(key);
      console.log(`[RedisCacheService] DEL ${key}: Success`);
    } catch (error) {
      console.error(
        `[RedisCacheService] DEL Error for key ${key}:`,
        error.message,
      );
    }
  }
}
