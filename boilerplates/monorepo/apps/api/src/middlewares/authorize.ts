import { Request, Response, NextFunction } from 'express';
import { AppError } from '../helpers/appError';
import { UserRole } from '../models/user.model';

export const authorize =
  (...roles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) throw new AppError('Not authenticated', 401);
    if (!roles.includes(req.user.role as UserRole)) {
      throw new AppError('Forbidden: insufficient permissions', 403);
    }
    next();
  };
