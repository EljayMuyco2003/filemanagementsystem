import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service';

const dashboardService = new DashboardService();

export class DashboardController {
  /**
   * @swagger
   * /api/dashboard/stats:
   *   get:
   *     summary: Get dashboard statistics
   *     tags: [Dashboard]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Dashboard statistics
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 userUploads:
   *                   type: integer
   *                 totalTemplates:
   *                   type: integer
   *                 totalUsers:
   *                   type: integer
   *                 recentFiles:
   *                   type: array
   *                   items:
   *                     type: object
   */
  async getStats(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const isAdmin = req.user.role === 'admin';
      const stats = await dashboardService.getStats(req.user.id, isAdmin);

      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
