import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { body, validationResult } from 'express-validator';

const userService = new UserService();

export class UserController {
  // Validation rules
  static createValidation = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('role').optional().isIn(['admin', 'user']).withMessage('Role must be admin or user')
  ];

  /**
   * @swagger
   * /api/admin/users:
   *   get:
   *     summary: Get all users (Admin only)
   *     tags: [Admin]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of users
   */
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * @swagger
   * /api/admin/users/{id}:
   *   get:
   *     summary: Get user by ID (Admin only)
   *     tags: [Admin]
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
   *         description: User details
   *       404:
   *         description: User not found
   */
  async getUserById(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      const user = await userService.getUserById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * @swagger
   * /api/admin/users:
   *   post:
   *     summary: Create a new user (Admin only)
   *     tags: [Admin]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *                 minLength: 8
   *               role:
   *                 type: string
   *                 enum: [admin, user]
   *     responses:
   *       201:
   *         description: User created successfully
   */
  async createUser(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, role } = req.body;
      const user = await userService.createUser(email, password, role);

      res.status(201).json({
        message: 'User created successfully',
        user
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * @swagger
   * /api/admin/users/{id}:
   *   delete:
   *     summary: Delete a user (Admin only)
   *     tags: [Admin]
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
   *         description: User deleted successfully
   *       404:
   *         description: User not found
   */
  async deleteUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      
      // Prevent deleting yourself
      if (req.user && req.user.id === userId) {
        return res.status(400).json({ error: 'Cannot delete your own account' });
      }

      const deleted = await userService.deleteUser(userId);

      if (!deleted) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ message: 'User deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
