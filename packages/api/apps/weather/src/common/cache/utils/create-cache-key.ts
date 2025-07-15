export function createCacheKey(prefix: string, key: string) {
  return `${prefix}${key.toLowerCase()}`;
}
