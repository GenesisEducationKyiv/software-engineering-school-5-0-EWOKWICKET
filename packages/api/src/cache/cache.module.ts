import { CacheModule as CachingModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { CacheScheduler, CacheServiceInterface } from './abstractions/cache-service.interface';
import { CacheService } from './cache.service';
import { RedisConfig } from './config/redis.config';

@Module({
  imports: [
    CachingModule.registerAsync({
      useClass: RedisConfig,
    }),
  ],
  providers: [
    CacheService,
    {
      provide: CacheServiceInterface,
      useExisting: CacheService,
    },
    {
      provide: CacheScheduler,
      useExisting: CacheService,
    },
  ],
  exports: [CacheServiceInterface, CacheScheduler],
})
export class CacheModule {}
