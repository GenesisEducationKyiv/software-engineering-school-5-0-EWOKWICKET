import { CachePrefixes } from '../enums/cache-prefixes.enum';

export function transformKey(prefix: CachePrefixes, key: string) {
  return `${prefix}${key.toLowerCase()}`;
}
