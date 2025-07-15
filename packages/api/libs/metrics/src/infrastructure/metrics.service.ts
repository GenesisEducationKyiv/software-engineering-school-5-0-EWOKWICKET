import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';
import { Metrics } from '../application/constants/metrics';
import { CacheMetrics } from '../application/interfaces/metrics-service.interface';

@Injectable()
export class MetricsService implements CacheMetrics {
  constructor(
    @InjectMetric(Metrics.cacheHit.name) private cacheHitCounter: Counter<string>,
    @InjectMetric(Metrics.cacheMiss.name) private cacheMissCounter: Counter<string>,
  ) {}

  incCacheHit(): void {
    this.cacheHitCounter.inc();
  }

  incCacheMiss(): void {
    this.cacheMissCounter.inc();
  }
}
