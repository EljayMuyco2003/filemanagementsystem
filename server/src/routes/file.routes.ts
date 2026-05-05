import { Router } from 'express';
import { FileController } from '../controllers/file.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { upload, handleMulterError } from '../middleware/upload.middleware';

const router = Router();
const fileController = new FileController();

// All file routes require authentication
router.use(authMiddleware);

router.get('/', fileController.getFiles);
router.get('/:id', fileController.getFileById);
router.post('/', upload.single('file'), handleMulterError, fileController.uploadFile);
router.delete('/:id', fileController.deleteFile);

export default router;
