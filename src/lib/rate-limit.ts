import { LRUCache } from 'lru-cache';

const options = {
  max: 500, // Max number of IPs to track
  ttl: 60 * 1000, // 1 minute
};

const tokenCache = new LRUCache<string, number>(options);

export function checkRateLimit(ip: string, limit: number = 10): boolean {
  const count = tokenCache.get(ip) || 0;
  if (count >= limit) {
    return false;
  }
  tokenCache.set(ip, count + 1);
  return true;
}
