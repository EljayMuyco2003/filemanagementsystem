import { Router } from 'express';
import { TemplateController } from '../controllers/template.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';
import { upload, handleMulterError } from '../middleware/upload.middleware';

const router = Router();
const templateController = new TemplateController();

// All template routes require authentication
router.use(authMiddleware);

// Public (authenticated users)
router.get('/', templateController.getAllTemplates);
router.get('/:id', templateController.getTemplateById);

// Admin only
router.post('/', roleMiddleware(['admin']), upload.single('file'), handleMulterError, templateController.createTemplate);
router.delete('/:id', roleMiddleware(['admin']), templateController.deleteTemplate);

export default router;
