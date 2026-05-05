import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const router = Router();
const userController = new UserController();

// All user management routes require authentication and admin role
router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', UserController.createValidation, userController.createUser);
router.delete('/:id', userController.deleteUser);

export default router;
