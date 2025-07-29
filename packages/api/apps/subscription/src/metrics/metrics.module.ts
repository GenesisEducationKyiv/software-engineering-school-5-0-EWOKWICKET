import { Metrics } from '@common/metrics/constants/metrics';
import { REDMetrics } from '@common/metrics/interfaces/metrics-service.interface';
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
    {
      provide: REDMetrics,
      useClass: MetricsService,
    },
    makeCounterProvider(Metrics.requestTotal),
    makeCounterProvider(Metrics.errorTotal),
    makeHistogramProvider({
      ...Metrics.requestDuration,
      buckets: [10, 50, 100, 250, 500, 1000, 2000, 5000],
    }),
  ],
  exports: [REDMetrics],
})
export class MetricsModule {}
