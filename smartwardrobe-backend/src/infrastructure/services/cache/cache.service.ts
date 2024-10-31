import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getFromCache<T>(cacheKey: string): Promise<T | null> {
    const cachedData = await this.cacheManager.get<T>(cacheKey);
    return cachedData || null;
  }

  async setToCache<T>(cacheKey: string, data: T): Promise<void> {
    await this.cacheManager.set(cacheKey, data);
  }

  generateCacheKey(key: string): string {
    return key;
  }
}
