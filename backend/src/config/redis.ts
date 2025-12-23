import { createClient } from 'redis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

let redisClient: ReturnType<typeof createClient> | null = null;

export const getRedisClient = () => {
  if (!redisClient) {
    redisClient = createClient({
      url: REDIS_URL,
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('Redis Client Connected');
    });

    // Only connect if REDIS_URL is provided
    if (REDIS_URL) {
      redisClient.connect().catch(console.error);
    }
  }
  return redisClient;
};

// Helper functions for caching
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const client = getRedisClient();
      if (!client || !client.isReady) return null;
      
      const data = await client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  },

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    try {
      const client = getRedisClient();
      if (!client || !client.isReady) return;

      const data = JSON.stringify(value);
      if (ttlSeconds) {
        await client.setEx(key, ttlSeconds, data);
      } else {
        await client.set(key, data);
      }
    } catch (error) {
      console.error('Redis SET error:', error);
    }
  },

  async del(key: string): Promise<void> {
    try {
      const client = getRedisClient();
      if (!client || !client.isReady) return;

      await client.del(key);
    } catch (error) {
      console.error('Redis DEL error:', error);
    }
  },

  async delPattern(pattern: string): Promise<void> {
    try {
      const client = getRedisClient();
      if (!client || !client.isReady) return;

      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        await client.del(keys);
      }
    } catch (error) {
      console.error('Redis DEL pattern error:', error);
    }
  },
};

export default getRedisClient;

