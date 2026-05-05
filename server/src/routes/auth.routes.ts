import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/register', AuthController.registerValidation, authController.register);
router.post('/login', AuthController.loginValidation, authController.login);

// Protected routes
router.get('/me', authMiddleware, authController.me);

export default router;
