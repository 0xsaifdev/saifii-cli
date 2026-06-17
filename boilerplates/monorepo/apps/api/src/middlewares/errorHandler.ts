import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { MongoError } from 'mongodb';
import mongoose from 'mongoose';
import { AppError } from '../helpers/appError';
import { logger } from '../config/logger';

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // AppError (known operational errors)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  // Mongoose Validation Error
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(422).json({ success: false, message: 'Validation failed', errors });
  }

  // Mongoose Cast Error (bad ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ success: false, message: `Invalid ${err.path}: ${err.value}` });
  }

  // MongoDB Duplicate Key
  if ((err as MongoError).code === 11000) {
    const field = Object.keys((err as any).keyValue || {})[0];
    return res
      .status(409)
      .json({ success: false, message: `Duplicate value for field: ${field}` });
  }

  // JWT Errors
  if ((err as Error).name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
  if ((err as Error).name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expired' });
  }

  // Unknown error
  logger.error({ err, reqId: req.id }, 'Unhandled error');
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: String(err) }),
  });
};
