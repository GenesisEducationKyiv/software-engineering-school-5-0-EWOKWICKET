import { Metrics } from '@common/metrics/constants/metrics';
import { CacheMetrics } from '@common/metrics/interfaces/metrics-service.interface';
import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';

@Injectable()
export class MetricsService implements CacheMetrics {
  constructor(
    @InjectMetric(Metrics.cacheHit.name) private cacheHitCounter: Counter,
    @InjectMetric(Metrics.cacheMiss.name) private cacheMissCounter: Counter,
  ) {}

  onCacheHit(): void {
    this.cacheHitCounter.inc();
  }

  onCacheMiss(): void {
    this.cacheMissCounter.inc();
  }
}
