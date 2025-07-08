export abstract class CacheAccessor {
  abstract set<T>(key: string, value: T, ttl: number): Promise<void>;
  abstract get<T>(key: string): Promise<T>;
}

export abstract class CacheInvalidator {
  abstract mdel(keys: string[]): Promise<void>;
}
