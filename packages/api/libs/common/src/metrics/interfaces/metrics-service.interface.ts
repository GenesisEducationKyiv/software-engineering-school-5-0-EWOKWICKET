export abstract class CacheMetrics {
  abstract incCacheHit(): void;
  abstract incCacheMiss(): void;
}

export abstract class REDMetrics {
  abstract onRequestStart(transport: string, route: string): void;
  abstract onRequestEnd(transport: string, route: string, durationMs: number): void;
  abstract onRequestError(transport: string, route: string): void;
}
