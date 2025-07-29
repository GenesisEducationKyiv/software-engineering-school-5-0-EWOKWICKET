import { Metrics } from '@common/metrics/constants/metrics';
import { CacheMetrics, REDMetrics } from '@common/metrics/interfaces/metrics-service.interface';
import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';

@Injectable()
export class MetricsService implements CacheMetrics, REDMetrics {
  constructor(
    @InjectMetric(Metrics.cacheHit.name) private cacheHitCounter: Counter,
    @InjectMetric(Metrics.cacheMiss.name) private cacheMissCounter: Counter,
    @InjectMetric(Metrics.requestTotal.name) private requestTotalCounter: Counter,
    @InjectMetric(Metrics.errorTotal.name) private errorTotalCounter: Counter,
    @InjectMetric(Metrics.requestDuration.name) private durationHistogram: Histogram,
  ) {}

  incCacheHit(): void {
    this.cacheHitCounter.inc();
  }

  incCacheMiss(): void {
    this.cacheMissCounter.inc();
  }

  onRequestStart(transport: string, route: string): void {
    this.requestTotalCounter.inc({ transport, route });
  }

  onRequestEnd(transport: string, route: string, durationMs: number): void {
    this.durationHistogram.observe({ transport, route }, durationMs);
  }

  onRequestError(transport: string, route: string): void {
    this.errorTotalCounter.inc({ transport, route });
  }
}
