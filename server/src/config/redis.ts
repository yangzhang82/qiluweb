import Redis from 'ioredis';

let redis: Redis;

export const connectRedis = async (): Promise<void> => {
  try {
    // 在开发环境中，如果没有Redis，跳过连接
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠️  Redis未配置，使用内存缓存模拟');
      return;
    }

    redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD || undefined,
      maxRetriesPerRequest: 3,
    });

    redis.on('connect', () => {
      console.log('Redis连接成功');
    });

    redis.on('error', (error) => {
      console.error('Redis连接错误:', error);
    });

    // 测试连接
    await redis.ping();
  } catch (error) {
    console.error('Redis连接失败:', error);
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠️  开发环境Redis连接失败，使用内存缓存');
      return;
    }
    throw error;
  }
};

// 简单的内存缓存实现
class MemoryCache {
  private cache = new Map<string, { value: string; expiry: number }>();

  async setex(key: string, ttl: number, value: string): Promise<void> {
    const expiry = Date.now() + ttl * 1000;
    this.cache.set(key, { value, expiry });
  }

  async get(key: string): Promise<string | null> {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  async ping(): Promise<string> {
    return 'PONG';
  }

  async quit(): Promise<void> {
    this.cache.clear();
  }
}

const memoryCache = new MemoryCache();

export const getRedis = () => {
  if (!redis) {
    console.log('⚠️  Redis未配置，使用内存缓存模拟');
    // 返回模拟的Redis客户端，而不是抛出错误
    return {
      get: async (key: string) => null,
      set: async (key: string, value: string, ttl?: number) => 'OK',
      del: async (key: string) => 1,
      exists: async (key: string) => 0,
      expire: async (key: string, seconds: number) => 1
    };
  }
  return redis;
};

export const closeRedis = async (): Promise<void> => {
  if (redis) {
    await redis.quit();
  }
};

