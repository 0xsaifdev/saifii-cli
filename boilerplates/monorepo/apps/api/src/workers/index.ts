import { emailWorker } from './email.worker';
import { logger } from '../config/logger';

export const startWorkers = async (): Promise<void> => {
  emailWorker.on('completed', (job) => {
    logger.info({ jobId: job.id, queue: 'email' }, 'Job completed');
  });

  emailWorker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, queue: 'email', err }, 'Job failed');
  });

  logger.info('✅ Workers started');
};

export const stopWorkers = async (): Promise<void> => {
  await emailWorker.close();
  logger.info('Workers stopped');
};
