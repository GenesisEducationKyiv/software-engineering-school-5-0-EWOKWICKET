import { MINUTE } from 'src/common/utils/time-units';
import { CacheAccessor } from 'src/infrastructure/cache/interfaces/cache-service.interface';
import { MetricsService } from 'src/infrastructure/metrics/metrics.service';

export class CacheMetricsDecorator implements CacheAccessor {
  constructor(
    private readonly wrapped: CacheAccessor,
    private readonly metricsService: MetricsService,
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
