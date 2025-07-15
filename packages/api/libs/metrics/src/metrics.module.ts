import { Module } from '@nestjs/common';
import { makeCounterProvider, PrometheusModule } from '@willsoto/nestjs-prometheus';
import { Metrics } from './application/constants/metrics';
import { CacheMetrics } from './application/interfaces/metrics-service.interface';
import { MetricsService } from './infrastructure/metrics.service';

@Module({
  imports: [
    PrometheusModule.register({
      defaultMetrics: {
        enabled: false,
      },
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
