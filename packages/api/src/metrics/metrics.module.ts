import { Module } from '@nestjs/common';
import { makeCounterProvider, PrometheusModule } from '@willsoto/nestjs-prometheus';
import { Metrics } from './constants/metrics.freeze';
import { MetricsService } from './metrics.service';

@Module({
  imports: [
    PrometheusModule.register({
      defaultMetrics: {
        enabled: false,
      },
    }),
  ],
  providers: [MetricsService, makeCounterProvider(Metrics.cacheHit), makeCounterProvider(Metrics.cacheMiss)],
  exports: [MetricsService],
})
export class MetricsModule {}
