import { pool } from '../config/database';
import { UploadedFile } from '../types';
import fs from 'fs';
import path from 'path';

export class FileService {
  async getUserFiles(userId: number): Promise<UploadedFile[]> {
    const result = await pool.query(
      'SELECT * FROM uploaded_files WHERE user_id = $1 ORDER BY uploaded_at DESC',
      [userId]
    );

    return result.rows;
  }

  async getAllFiles(): Promise<any[]> {
    const result = await pool.query(
      `SELECT uf.*, u.email, p.first_name, p.last_name
       FROM uploaded_files uf
       JOIN users u ON uf.user_id = u.id
       LEFT JOIN profiles p ON u.id = p.user_id
       ORDER BY uf.uploaded_at DESC`
    );

    return result.rows;
  }

  async getFileById(fileId: number): Promise<UploadedFile | null> {
    const result = await pool.query(
      'SELECT * FROM uploaded_files WHERE id = $1',
      [fileId]
    );

    return result.rows[0] || null;
  }

  async createFile(
    userId: number,
    fileName: string,
    fileUrl: string,
    fileKey: string,
    fileSize: number
  ): Promise<UploadedFile> {
    const result = await pool.query(
      `INSERT INTO uploaded_files (user_id, file_name, file_url, file_key, file_size)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, fileName, fileUrl, fileKey, fileSize]
    );

    return result.rows[0];
  }

  async deleteFile(fileId: number, userId: number, isAdmin: boolean): Promise<boolean> {
    // Get file info
    const file = await this.getFileById(fileId);
    
    if (!file) {
      throw new Error('File not found');
    }

    // Check ownership (unless admin)
    if (!isAdmin && file.user_id !== userId) {
      throw new Error('You do not have permission to delete this file');
    }

    // Delete from database
    const result = await pool.query(
      'DELETE FROM uploaded_files WHERE id = $1',
      [fileId]
    );

    // Delete physical file
    try {
      const filePath = path.join(process.cwd(), file.file_url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('Error deleting physical file:', error);
    }

    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getFileCount(userId?: number): Promise<number> {
    let query = 'SELECT COUNT(*) FROM uploaded_files';
    const params: any[] = [];

    if (userId) {
      query += ' WHERE user_id = $1';
      params.push(userId);
    }

    const result = await pool.query(query, params);
    return parseInt(result.rows[0].count);
  }
}
