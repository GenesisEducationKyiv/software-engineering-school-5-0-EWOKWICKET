import { CacheModule as CachingModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { CacheMetricsDecorator } from 'src/common/decorators/cache-metrics.decorator';
import { MetricsModule } from 'src/metrics/metrics.module';
import { MetricsService } from 'src/metrics/metrics.service';
import { CacheService } from './cache.service';
import { RedisConfig } from './config/redis.config';
import { CacheScheduler, CacheServiceInterface } from './interfaces/cache-service.interface';

@Module({
  imports: [
    CachingModule.registerAsync({
      useClass: RedisConfig,
    }),
    MetricsModule,
  ],
  providers: [
    CacheService,
    {
      provide: CacheServiceInterface,
      useFactory: (cacheService: CacheService, metricsService: MetricsService) => {
        return new CacheMetricsDecorator(cacheService, metricsService);
      },
      inject: [CacheService, MetricsService],
    },
    {
      provide: CacheScheduler,
      useExisting: CacheService,
    },
  ],
  exports: [CacheServiceInterface, CacheScheduler],
})
export class CacheModule {}
