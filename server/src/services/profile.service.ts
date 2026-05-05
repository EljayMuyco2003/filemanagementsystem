import { pool } from '../config/database';
import { Profile } from '../types';

export class ProfileService {
  async getProfile(userId: number): Promise<Profile | null> {
    const result = await pool.query(
      'SELECT * FROM profiles WHERE user_id = $1',
      [userId]
    );

    return result.rows[0] || null;
  }

  async upsertProfile(userId: number, profileData: Partial<Profile>): Promise<Profile> {
    const {
      first_name,
      last_name,
      employee_id,
      department,
      position,
      office,
      contact_number
    } = profileData;

    // Check if profile exists
    const existing = await this.getProfile(userId);

    if (existing) {
      // Update existing profile
      const result = await pool.query(
        `UPDATE profiles 
         SET first_name = $1, last_name = $2, employee_id = $3, 
             department = $4, position = $5, office = $6, 
             contact_number = $7, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $8
         RETURNING *`,
        [first_name, last_name, employee_id, department, position, office, contact_number, userId]
      );
      return result.rows[0];
    } else {
      // Create new profile
      const result = await pool.query(
        `INSERT INTO profiles (user_id, first_name, last_name, employee_id, department, position, office, contact_number)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [userId, first_name, last_name, employee_id, department, position, office, contact_number]
      );
      return result.rows[0];
    }
  }

  async deleteProfile(userId: number): Promise<boolean> {
    const result = await pool.query(
      'DELETE FROM profiles WHERE user_id = $1',
      [userId]
    );

    return result.rowCount ? result.rowCount > 0 : false;
  }
}
