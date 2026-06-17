import { createClient, RedisClientType } from 'redis';
import { env } from './env';
import { logger } from './logger';

let redisClient: RedisClientType;

export const connectRedis = async (): Promise<void> => {
  redisClient = createClient({ url: env.REDIS_URL }) as RedisClientType;

  redisClient.on('connect', () => logger.info('✅ Redis connected'));
  redisClient.on('error', (err) => logger.error({ err }, 'Redis error'));
  redisClient.on('reconnecting', () => logger.warn('Redis reconnecting...'));

  await redisClient.connect();
};

export const getRedisClient = (): RedisClientType => {
  if (!redisClient) throw new Error('Redis client not initialized. Call connectRedis() first.');
  return redisClient;
};

export const disconnectRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    logger.info('Redis disconnected gracefully');
  }
};
