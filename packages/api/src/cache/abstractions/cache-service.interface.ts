export abstract class CacheServiceInterface {
  abstract set<T>(key: string, value: T, ttl: number): Promise<void>;
  abstract get<T>(key: string): Promise<T>;
}

export abstract class CacheScheduler {
  abstract invalidateCurrentWeather(cities: string[]): Promise<void>;
}
