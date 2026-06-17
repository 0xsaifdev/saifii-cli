import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../helpers/jwt';
import { User } from '../models/user.model';
import { AppError } from '../helpers/appError';
import { asyncHandler } from '../helpers/asyncHandler';

export const authenticate = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);

    const user = await User.findById(payload.sub).lean();
    if (!user) throw new AppError('User not found', 401);

    req.user = { id: user._id.toString(), role: user.role, email: user.email };
    next();
  }
);
