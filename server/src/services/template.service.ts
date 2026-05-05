import { pool } from '../config/database';
import { Template } from '../types';

export class TemplateService {
  async getAllTemplates(): Promise<Template[]> {
    const result = await pool.query(
      'SELECT * FROM templates ORDER BY created_at DESC'
    );

    return result.rows;
  }

  async getTemplateById(templateId: number): Promise<Template | null> {
    const result = await pool.query(
      'SELECT * FROM templates WHERE id = $1',
      [templateId]
    );

    return result.rows[0] || null;
  }

  async createTemplate(
    name: string,
    description: string | undefined,
    fileUrl: string,
    fileType: string
  ): Promise<Template> {
    // Check if template with same name exists
    const existing = await pool.query(
      'SELECT id FROM templates WHERE name = $1',
      [name]
    );

    if (existing.rows.length > 0) {
      throw new Error('Template with this name already exists');
    }

    const result = await pool.query(
      `INSERT INTO templates (name, description, file_url, file_type)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, description, fileUrl, fileType]
    );

    return result.rows[0];
  }

  async updateTemplate(
    templateId: number,
    name?: string,
    description?: string,
    fileUrl?: string,
    fileType?: string
  ): Promise<Template> {
    const template = await this.getTemplateById(templateId);
    
    if (!template) {
      throw new Error('Template not found');
    }

    const result = await pool.query(
      `UPDATE templates 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           file_url = COALESCE($3, file_url),
           file_type = COALESCE($4, file_type)
       WHERE id = $5
       RETURNING *`,
      [name, description, fileUrl, fileType, templateId]
    );

    return result.rows[0];
  }

  async deleteTemplate(templateId: number): Promise<boolean> {
    const result = await pool.query(
      'DELETE FROM templates WHERE id = $1',
      [templateId]
    );

    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getTemplateCount(): Promise<number> {
    const result = await pool.query('SELECT COUNT(*) FROM templates');
    return parseInt(result.rows[0].count);
  }
}
