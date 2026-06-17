import { Worker, Queue, QueueEvents } from 'bullmq';
import { env } from '../config/env';
import { logger } from '../config/logger';

export interface EmailJobData {
  to: string;
  subject: string;
  template: 'welcome' | 'reset-password' | 'email-verification';
  context: Record<string, unknown>;
}

const connection = { url: env.REDIS_URL };

// ─── Queue (producer) ────────────────────────────────────────────────────────
export const emailQueue = new Queue<EmailJobData>('email', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 },
  },
});

// ─── Worker (consumer) ───────────────────────────────────────────────────────
export const emailWorker = new Worker<EmailJobData>(
  'email',
  async (job) => {
    const { to, subject, template, context } = job.data;
    logger.info({ jobId: job.id, to, subject, template }, 'Processing email job');

    // TODO: Plug in your email provider (nodemailer, SendGrid, Resend, etc.)
    // Example: await sendEmail({ to, subject, template, context });

    logger.info({ jobId: job.id, to }, 'Email sent successfully');
  },
  { connection, concurrency: 5 }
);

export const emailQueueEvents = new QueueEvents('email', { connection });

// ─── Helper to enqueue emails ────────────────────────────────────────────────
export const sendEmail = async (data: EmailJobData, delay = 0) => {
  const job = await emailQueue.add(data.template, data, { delay });
  return job;
};
