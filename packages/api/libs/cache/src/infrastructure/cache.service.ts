import { MINUTE } from '@common/utils/time-units';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import Keyv from 'keyv';
import { CacheAccessor, CacheInvalidator } from '../application/interfaces/cache-service.interface';

@Injectable()
export class CacheService implements CacheAccessor, CacheInvalidator {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Keyv) {}

  async set<T>(key: string, value: T, ttl: number = MINUTE * 10): Promise<void> {
    await this.cacheManager.set<T>(key, value, ttl);
  }

  async get<T>(key: string): Promise<T> {
    return await this.cacheManager.get<T>(key);
  }

  async mdel(keys: string[]): Promise<void> {
    await this.cacheManager.deleteMany(keys);
    // await Promise.all(keys.map((key) => this.cacheManager.delete(key)));
  }
}
