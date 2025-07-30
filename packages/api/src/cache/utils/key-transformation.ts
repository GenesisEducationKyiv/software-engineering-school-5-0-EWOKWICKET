export function transformKey(prefix: string, key: string) {
  return `${prefix}${key.toLowerCase()}`;
}
