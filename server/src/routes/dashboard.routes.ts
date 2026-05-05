import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const dashboardController = new DashboardController();

// All dashboard routes require authentication
router.use(authMiddleware);

router.get('/stats', dashboardController.getStats);

export default router;
