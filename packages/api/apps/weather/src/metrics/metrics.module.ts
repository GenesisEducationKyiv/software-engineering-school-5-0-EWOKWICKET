import { Metrics } from '@common/metrics/constants/metrics';
import { CacheMetrics, REDMetrics } from '@common/metrics/interfaces/metrics-service.interface';
import { Module } from '@nestjs/common';
import { makeCounterProvider, makeHistogramProvider, PrometheusModule } from '@willsoto/nestjs-prometheus';
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
    MetricsService,
    {
      provide: CacheMetrics,
      useExisting: MetricsService,
    },
    {
      provide: REDMetrics,
      useExisting: MetricsService,
    },
    makeCounterProvider(Metrics.cacheHit),
    makeCounterProvider(Metrics.cacheMiss),
    makeCounterProvider(Metrics.requestTotal),
    makeCounterProvider(Metrics.errorTotal),
    makeHistogramProvider({
      ...Metrics.requestDuration,
      buckets: [10, 50, 100, 250, 500, 1000, 2000, 5000],
    }),
  ],
  exports: [CacheMetrics, REDMetrics],
})
export class MetricsModule {}
