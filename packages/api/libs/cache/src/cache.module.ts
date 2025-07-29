import { CacheMetrics } from '@common/metrics/interfaces/metrics-service.interface';
import { MINUTE } from '@common/utils/time-units';
import KeyvRedis from '@keyv/redis';
import { CacheModule as CachingModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheAccessor, CacheInvalidator } from './application/interfaces/cache-service.interface';
import cacheConfig from './config/cache.config';
import { cacheEnvSchema } from './config/env.validation';
import { CacheService } from './infrastructure/cache.service';
import { CacheMetricsDecorator } from './infrastructure/decorators/cache-metrics.decorator';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [cacheConfig],
      validationSchema: cacheEnvSchema,
    }),
    CachingModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: () => new KeyvRedis(configService.get('cache.redis.url')),
        ttl: 10 * MINUTE,
      }),
    }),
    MetricsModule,
  ],
  providers: [
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
