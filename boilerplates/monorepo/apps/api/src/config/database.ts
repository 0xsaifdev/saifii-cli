import mongoose from 'mongoose';
import { env } from './env';
import { logger } from './logger';

const MONGO_OPTIONS: mongoose.ConnectOptions = {
  dbName: env.MONGODB_DB_NAME,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
};

export const connectDatabase = async (): Promise<void> => {
  try {
    mongoose.set('strictQuery', true);

    mongoose.connection.on('connected', () => {
      logger.info('✅ MongoDB connected');
    });

    mongoose.connection.on('error', (err) => {
      logger.error({ err }, 'MongoDB connection error');
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    await mongoose.connect(env.MONGODB_URI, MONGO_OPTIONS);
  } catch (error) {
    logger.fatal({ error }, 'Failed to connect to MongoDB');
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected gracefully');
};

export const getConnection = (): mongoose.Connection => mongoose.connection;
