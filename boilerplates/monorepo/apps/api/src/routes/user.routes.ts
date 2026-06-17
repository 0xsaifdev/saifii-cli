import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';

const router = Router();

router.use(authenticate);

router.get('/', authorize('admin'), UserController.findAll);
router.get('/:id', UserController.findById);
router.patch('/:id', UserController.update);
router.delete('/:id', authorize('admin'), UserController.remove);

export default router;
