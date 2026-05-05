import { Request, Response } from 'express';
import { ProfileService } from '../services/profile.service';
import { body, validationResult } from 'express-validator';

const profileService = new ProfileService();

export class ProfileController {
  // Validation rules
  static updateValidation = [
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
    body('employee_id').optional(),
    body('department').optional(),
    body('position').optional(),
    body('office').optional(),
    body('contact_number').optional()
  ];

  /**
   * @swagger
   * /api/profile:
   *   get:
   *     summary: Get current user's profile
   *     tags: [Profile]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Profile retrieved successfully
   *       404:
   *         description: Profile not found
   */
  async getProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const profile = await profileService.getProfile(req.user.id);
      
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      res.json({ profile });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * @swagger
   * /api/profile:
   *   patch:
   *     summary: Update current user's profile
   *     tags: [Profile]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - first_name
   *               - last_name
   *             properties:
   *               first_name:
   *                 type: string
   *               last_name:
   *                 type: string
   *               employee_id:
   *                 type: string
   *               department:
   *                 type: string
   *               position:
   *                 type: string
   *               office:
   *                 type: string
   *               contact_number:
   *                 type: string
   *     responses:
   *       200:
   *         description: Profile updated successfully
   */
  async updateProfile(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const profile = await profileService.upsertProfile(req.user.id, req.body);

      res.json({
        message: 'Profile updated successfully',
        profile
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
