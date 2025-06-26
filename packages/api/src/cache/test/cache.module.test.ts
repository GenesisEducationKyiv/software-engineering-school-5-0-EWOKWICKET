import { Module } from '@nestjs/common';
import { CacheScheduler, CacheServiceInterface } from '../abstractions/cache-service.interface';

const cacheServiceMock: CacheServiceInterface & CacheScheduler = {
  set: async () => {},
  get: async () => null,
  invalidateCurrentWeather: async () => {},
};

@Module({
  providers: [
    { provide: CacheServiceInterface, useValue: cacheServiceMock },
    { provide: CacheScheduler, useValue: cacheServiceMock },
  ],
  exports: [CacheServiceInterface, CacheScheduler],
})
export class CacheTestModule {}
