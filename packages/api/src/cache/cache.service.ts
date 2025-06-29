import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { MINUTE } from 'src/common/utils/time-units';
import { CacheScheduler, CacheServiceInterface } from './abstractions/cache-service.interface';

@Injectable()
export class CacheService implements CacheServiceInterface, CacheScheduler {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async set<T>(key: string, value: T, ttl: number = 10 * MINUTE): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async get<T>(key: string): Promise<T> {
    const cache: T = await this.cacheManager.get(key);
    console.log('Cached: ', cache);
    return cache;
  }

  // invalidates on weather updates
  async invalidateCurrentWeather(cities: string[]): Promise<void> {
    const keys = cities.map((city) => `currentWeather:${city.toLowerCase()}`);
    await this.cacheManager.mdel(keys);
  }
}
