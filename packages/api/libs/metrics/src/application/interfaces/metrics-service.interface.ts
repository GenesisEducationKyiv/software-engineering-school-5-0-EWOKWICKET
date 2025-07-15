export abstract class CacheMetrics {
  abstract incCacheHit(): void;
  abstract incCacheMiss(): void;
}
