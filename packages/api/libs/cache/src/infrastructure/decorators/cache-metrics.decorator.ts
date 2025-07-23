import { MINUTE } from '@common/utils/time-units';
import { CacheMetrics } from '@metrics/application/interfaces/metrics-service.interface';
import { CacheAccessor } from '../../application/interfaces/cache-service.interface';

export class CacheMetricsDecorator implements CacheAccessor {
  constructor(
    private readonly wrapped: CacheAccessor,
    private readonly metricsService: CacheMetrics,
  ) {}

  async get<T>(key: string): Promise<T> {
    const data = await this.wrapped.get<T>(key);

    if (data !== undefined) this.metricsService.incCacheHit();
    else this.metricsService.incCacheMiss();

    return data;
  }

  async set<T>(key: string, value: T, ttl: number = MINUTE * 10): Promise<void> {
    return await this.wrapped.set<T>(key, value, ttl);
  }
}
