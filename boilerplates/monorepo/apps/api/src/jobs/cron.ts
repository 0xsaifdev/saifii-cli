import { Queue } from 'bullmq';
import { env } from '../config/env';
import { logger } from '../config/logger';

const connection = { url: env.REDIS_URL };

// ─── Scheduled job queues ─────────────────────────────────────────────────────
const cleanupQueue = new Queue('cleanup', {
  connection,
  defaultJobOptions: { removeOnComplete: 10, removeOnFail: 10 },
});

/**
 * Register repeating cron jobs.
 * Uses BullMQ's built-in cron scheduler (backed by Redis).
 */
export const registerCronJobs = async (): Promise<void> => {
  // Remove expired tokens every midnight
  await cleanupQueue.upsertJobScheduler(
    'remove-expired-tokens',
    { pattern: '0 0 * * *' },
    {
      name: 'cleanup-tokens',
      data: { type: 'tokens' },
    }
  );

  logger.info('✅ Cron jobs registered');
};
