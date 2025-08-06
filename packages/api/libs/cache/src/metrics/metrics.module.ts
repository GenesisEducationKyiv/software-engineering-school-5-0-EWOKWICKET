import { Metrics } from '@common/metrics/constants/metrics';
import { CacheMetrics } from '@common/metrics/interfaces/metrics-service.interface';
import { Module } from '@nestjs/common';
import { makeCounterProvider, PrometheusModule } from '@willsoto/nestjs-prometheus';
import { MetricsService } from './infrastructure/metrics.service';

@Module({
  imports: [
    PrometheusModule.register({
      defaultMetrics: {
        enabled: false,
      },
      path: '/metrics',
    }),
  ],
  providers: [
    {
      provide: CacheMetrics,
      useClass: MetricsService,
    },
    makeCounterProvider(Metrics.cacheHit),
    makeCounterProvider(Metrics.cacheMiss),
  ],
  exports: [CacheMetrics],
})
export class MetricsModule {}
