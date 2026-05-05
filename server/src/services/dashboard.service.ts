import { pool } from '../config/database';
import { DashboardStats } from '../types';

export class DashboardService {
  async getStats(userId: number, isAdmin: boolean): Promise<DashboardStats> {
    // Get user uploads count
    const userUploadsResult = await pool.query(
      'SELECT COUNT(*) FROM uploaded_files WHERE user_id = $1',
      [userId]
    );
    const userUploads = parseInt(userUploadsResult.rows[0].count);

    // Get total templates count
    const templatesResult = await pool.query('SELECT COUNT(*) FROM templates');
    const totalTemplates = parseInt(templatesResult.rows[0].count);

    // Get total users count (admin only)
    let totalUsers = 0;
    if (isAdmin) {
      const usersResult = await pool.query('SELECT COUNT(*) FROM users');
      totalUsers = parseInt(usersResult.rows[0].count);
    }

    // Get recent files (all files for admin, user's files for regular users)
    const recentFilesQuery = isAdmin
      ? `SELECT uf.id, uf.file_name as "fileName", uf.uploaded_at as "uploadedAt",
                u.email, p.first_name, p.last_name
         FROM uploaded_files uf
         JOIN users u ON uf.user_id = u.id
         LEFT JOIN profiles p ON u.id = p.user_id
         ORDER BY uf.uploaded_at DESC
         LIMIT 5`
      : `SELECT uf.id, uf.file_name as "fileName", uf.uploaded_at as "uploadedAt",
                u.email, p.first_name, p.last_name
         FROM uploaded_files uf
         JOIN users u ON uf.user_id = u.id
         LEFT JOIN profiles p ON u.id = p.user_id
         WHERE uf.user_id = $1
         ORDER BY uf.uploaded_at DESC
         LIMIT 5`;

    const recentFilesResult = isAdmin
      ? await pool.query(recentFilesQuery)
      : await pool.query(recentFilesQuery, [userId]);

    const recentFiles = recentFilesResult.rows.map((row: any) => ({
      id: row.id,
      fileName: row.fileName,
      uploadedAt: row.uploadedAt,
      uploaderName: row.first_name && row.last_name
        ? `${row.first_name} ${row.last_name}`
        : row.email
    }));

    return {
      userUploads,
      totalTemplates,
      ...(isAdmin && { totalUsers }),
      recentFiles
    };
  }
}
