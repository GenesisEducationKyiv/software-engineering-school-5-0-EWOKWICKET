import { CacheModule as CachingModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { MetricsService } from 'src/metrics/infrastructure/metrics.service';
import { MetricsModule } from 'src/metrics/metrics.module';
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
