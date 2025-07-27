import { CacheAccessor } from '@cache/application/interfaces/cache-service.interface';
import { createCacheKey } from '@cache/application/utils/create-cache-key';
import { NotificationType } from '@common/contracts/notifications/constants/notification-type.enum';
import { ConfirmationNotification, WeatherUpdateNotification } from '@common/contracts/notifications/constants/notifications.type';
import { MINUTE } from '@common/utils/time-units';
import { NotificationsServiceInterface } from 'src/application/interfaces/notifications-service.abstract';
import { CachePrefixes } from '../constants/notifications.cache-prefixes.enum';

export class NotificaionsCacheProxy implements NotificationsServiceInterface {
  private readonly ttl: number = MINUTE * 50;

  constructor(
    private readonly wrapped: NotificationsServiceInterface,
    private readonly cacheService: CacheAccessor,
  ) {}

  async sendConfirmationNotification(data: ConfirmationNotification, type: NotificationType): Promise<void> {
    const key = createCacheKey(CachePrefixes.CONFIRMATION, data.to);
    if (await this.cacheService.get<boolean>(key)) return;

    await this.wrapped.sendConfirmationNotification(data, type);
    await this.cacheService.set<boolean>(key, true, this.ttl);
  }

  async sendWeatherUpdateNotification(data: WeatherUpdateNotification, type: NotificationType): Promise<void> {
    const raw = JSON.stringify({ tp: data.to, city: data.data.city });
    const key = createCacheKey(CachePrefixes.WEATHER_UPDATE, raw);
    if (await this.cacheService.get<boolean>(key)) return;

    await this.wrapped.sendWeatherUpdateNotification(data, type);
    await this.cacheService.set<boolean>(key, true, this.ttl);
  }
}
