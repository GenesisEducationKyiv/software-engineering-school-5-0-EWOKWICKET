import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CachePrefixes } from './enums/cache-prefixes.enum';
import { CacheTTL } from './enums/cache-ttl.enum';
import { CacheScheduler, CacheServiceInterface } from './interfaces/cache-service.interface';

@Injectable()
export class CacheService implements CacheServiceInterface, CacheScheduler {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async set<T>(key: string, value: T, ttl: number = CacheTTL.MINUTES_10): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async get<T>(key: string): Promise<T> {
    return await this.cacheManager.get(key);
  }

  // invalidates on hourly weather updates
  async invalidateCurrentWeather(cities: string[]): Promise<void> {
    const keys = cities.map((city) => `${CachePrefixes.CURRENT_WEATHER}${city.toLowerCase()}`);
    await this.cacheManager.mdel(keys);
  }
}
