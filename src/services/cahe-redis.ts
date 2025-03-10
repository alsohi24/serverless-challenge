import Redis from 'ioredis';
import { config } from 'dotenv';

config();

let redis: Redis | null = null;

try {
  redis = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT) || 6379,
    tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
    retryStrategy: (times) => {
      return null; // Don't retry connection
    },
  });

  redis.on('connect', () => console.log('Connected to Redis'));
  redis.on('error', (err) => {
    console.warn('Could not connect to Redis: ', err.message);
    redis = null; // Disable Redis on error
  });
} catch (error) {
  console.warn('Redis unavailable, API will work without cache.');
  redis = null; // Ensure API doesn't depend on Redis
}

export class CacheService {
  // Store data in cache (only if Redis is available)
  public static async setCache(
    key: string,
    value: any,
    ttl: number = Number(process.env.REDIS_TTL) || 1800
  ): Promise<void> {
    if (!redis) return;
    try {
      await redis.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unexpected error occurred';
      console.warn('Error saving to Redis:', errorMessage);
    }
  }

  // Retrieve data from cache (only if Redis is available)
  public static async getCache(key: string): Promise<any | null> {
    if (!redis) return null; // Return null if Redis is unavailable
    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unexpected error occurred';
      console.warn('Error fetching from Redis: ', errorMessage);
      return null;
    }
  }
}
