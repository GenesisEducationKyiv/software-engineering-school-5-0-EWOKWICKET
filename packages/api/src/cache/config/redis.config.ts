import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisStore, redisStore } from 'cache-manager-redis-store';
import { MINUTE } from 'src/common/utils/time-units';

@Injectable()
export class RedisConfig implements CacheOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  async createCacheOptions(): Promise<CacheModuleOptions> {
    const store: RedisStore = await redisStore({
      url: this.configService.get<string>('cache.redis.url'),
    });

    return {
      ttl: 15 * MINUTE,
      store,
    };
  }
}
