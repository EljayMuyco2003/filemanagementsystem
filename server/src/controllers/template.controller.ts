import { Request, Response } from 'express';
import { TemplateService } from '../services/template.service';
import { body, validationResult } from 'express-validator';

const templateService = new TemplateService();

export class TemplateController {
  // Validation rules
  static createValidation = [
    body('name').notEmpty().withMessage('Template name is required'),
    body('description').optional(),
    body('file_url').notEmpty().withMessage('File URL is required'),
    body('file_type').notEmpty().withMessage('File type is required')
  ];

  /**
   * @swagger
   * /api/templates:
   *   get:
   *     summary: Get all templates
   *     tags: [Templates]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of templates
   */
  async getAllTemplates(req: Request, res: Response) {
    try {
      const templates = await templateService.getAllTemplates();
      res.json(templates);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * @swagger
   * /api/templates/{id}:
   *   get:
   *     summary: Get template by ID
   *     tags: [Templates]
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
   *         description: Template details
   *       404:
   *         description: Template not found
   */
  async getTemplateById(req: Request, res: Response) {
    try {
      const templateId = parseInt(req.params.id);
      const template = await templateService.getTemplateById(templateId);

      if (!template) {
        return res.status(404).json({ error: 'Template not found' });
      }

      res.json(template);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * @swagger
   * /api/templates:
   *   post:
   *     summary: Create a new template (Admin only)
   *     tags: [Templates]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - file_url
   *               - file_type
   *             properties:
   *               name:
   *                 type: string
   *               description:
   *                 type: string
   *               file_url:
   *                 type: string
   *               file_type:
   *                 type: string
   *     responses:
   *       201:
   *         description: Template created successfully
   */
  async createTemplate(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const { name, description, file_type } = req.body;
      const fileUrl = `/uploads/${req.file.filename}`;

      const template = await templateService.createTemplate(
        name, 
        description || '', 
        fileUrl, 
        file_type || req.file.originalname.split('.').pop() || 'unknown'
      );

      res.status(201).json({
        message: 'Template created successfully',
        template
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * @swagger
   * /api/templates/{id}:
   *   delete:
   *     summary: Delete a template (Admin only)
   *     tags: [Templates]
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
   *         description: Template deleted successfully
   *       404:
   *         description: Template not found
   */
  async deleteTemplate(req: Request, res: Response) {
    try {
      const templateId = parseInt(req.params.id);
      const deleted = await templateService.deleteTemplate(templateId);

      if (!deleted) {
        return res.status(404).json({ error: 'Template not found' });
      }

      res.json({ message: 'Template deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
