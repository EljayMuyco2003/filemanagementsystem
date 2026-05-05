import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const profileController = new ProfileController();

// All profile routes require authentication
router.use(authMiddleware);

router.get('/', profileController.getProfile);
router.patch('/', ProfileController.updateValidation, profileController.updateProfile);

export default router;
