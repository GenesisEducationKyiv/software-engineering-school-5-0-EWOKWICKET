import { HOUR, MINUTE } from 'src/common/utils/time-units';

export enum CacheTTL {
  MINUTES_10 = 10 * MINUTE,
  MINUTES_15 = 15 * MINUTE,
  HOUR_1 = HOUR,
}
