import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';

export const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);
