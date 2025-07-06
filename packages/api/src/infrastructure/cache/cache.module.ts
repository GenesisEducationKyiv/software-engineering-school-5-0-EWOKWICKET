import { CacheModule as CachingModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { CacheMetricsDecorator } from 'src/infrastructure/cache/decorators/cache-metrics.decorator';
import { MetricsModule } from 'src/infrastructure/metrics/metrics.module';
import { MetricsService } from 'src/infrastructure/metrics/metrics.service';
import { CacheService } from './cache.service';
import { RedisConfig } from './config/redis.config';
import { CacheAccessor, CacheInvalidator } from './interfaces/cache-service.interface';

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
      provide: CacheAccessor,
      useFactory: (cacheService: CacheService, metricsService: MetricsService) => {
        return new CacheMetricsDecorator(cacheService, metricsService);
      },
      inject: [CacheService, MetricsService],
    },
    {
      provide: CacheInvalidator,
      useExisting: CacheService,
    },
  ],
  exports: [CacheAccessor, CacheInvalidator],
})
export class CacheModule {}
