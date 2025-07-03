import { Inject } from '@nestjs/common';
import { CacheTTL } from 'src/cache/enums/cache-ttl.enum';
import { CacheServiceInterface } from 'src/cache/interfaces/cache-service.interface';
import { MetricsService } from 'src/metrics/metrics.service';

export class CacheMetricsDecorator implements CacheServiceInterface {
  constructor(
    @Inject(CacheServiceInterface)
    private readonly wrapped: CacheServiceInterface,
    private readonly metricsService: MetricsService,
  ) {}

  async get<T>(key: string): Promise<T> {
    const data = await this.wrapped.get<T>(key);

    if (data) this.metricsService.incCacheHit();
    else this.metricsService.incCacheMiss();

    return data;
  }

  async set<T>(key: string, value: T, ttl: number = CacheTTL.MINUTES_10): Promise<void> {
    return await this.wrapped.set<T>(key, value, ttl);
  }
}
