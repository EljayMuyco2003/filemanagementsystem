import { Request, Response } from 'express';
import { FileService } from '../services/file.service';

const fileService = new FileService();

export class FileController {
  /**
   * @swagger
   * /api/files:
   *   get:
   *     summary: Get files (user's own files or all files for admin)
   *     tags: [Files]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of files
   */
  async getFiles(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Admin sees all files with uploader info, regular users see only their files
      const files = req.user.role === 'admin' 
        ? await fileService.getAllFiles()
        : await fileService.getUserFiles(req.user.id);
      
      res.json(files);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * @swagger
   * /api/files/{id}:
   *   get:
   *     summary: Get file by ID
   *     tags: [Files]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: File details
   *       404:
   *         description: File not found
   */
  async getFileById(req: Request, res: Response) {
    try {
      const fileId = parseInt(req.params.id);
      const file = await fileService.getFileById(fileId);

      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }

      res.json(file);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * @swagger
   * /api/files:
   *   post:
   *     summary: Upload a new file
   *     tags: [Files]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - file
   *             properties:
   *               file:
   *                 type: string
   *                 format: binary
   *     responses:
   *       201:
   *         description: File uploaded successfully
   */
  async uploadFile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const fileUrl = `/uploads/${req.file.filename}`;
      const fileKey = req.file.filename;

      const file = await fileService.createFile(
        req.user.id,
        req.file.originalname,
        fileUrl,
        fileKey,
        req.file.size
      );

      res.status(201).json({
        message: 'File uploaded successfully',
        file
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * @swagger
   * /api/files/{id}:
   *   delete:
   *     summary: Delete a file
   *     tags: [Files]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: File deleted successfully
   *       404:
   *         description: File not found
   */
  async deleteFile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const fileId = parseInt(req.params.id);
      const isAdmin = req.user.role === 'admin';

      await fileService.deleteFile(fileId, req.user.id, isAdmin);

      res.json({ message: 'File deleted successfully' });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}
