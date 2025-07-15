import { CacheMetrics } from '@metrics/application/interfaces/metrics-service.interface';
import { MetricsModule } from '@metrics/metrics.module';
import { CacheModule as CachingModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { CacheAccessor, CacheInvalidator } from './application/interfaces/cache-service.interface';
import { RedisConfig } from './config/redis.config';
import { CacheService } from './infrastructure/cache.service';
import { CacheMetricsDecorator } from './infrastructure/decorators/cache-metrics.decorator';

@Module({
  imports: [
    CachingModule.registerAsync({
      useClass: RedisConfig,
    }),
    MetricsModule,
  ],
  providers: [
    RedisConfig,
    CacheService,
    {
      provide: CacheAccessor,
      useFactory: (cacheService: CacheService, metricsService: CacheMetrics) => {
        return new CacheMetricsDecorator(cacheService, metricsService);
      },
      inject: [CacheService, CacheMetrics],
    },
    {
      provide: CacheInvalidator,
      useExisting: CacheService,
    },
  ],
  exports: [CacheAccessor, CacheInvalidator],
})
export class CacheModule {}
