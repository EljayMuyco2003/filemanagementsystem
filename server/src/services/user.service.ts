import bcrypt from 'bcryptjs';
import { pool } from '../config/database';
import { UserResponse } from '../types';

export class UserService {
  async getAllUsers(): Promise<any[]> {
    const result = await pool.query(
      `SELECT u.id, u.email, u.role, u.created_at, 
              p.first_name, p.last_name
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       ORDER BY u.created_at DESC`
    );

    return result.rows;
  }

  async getUserById(userId: number): Promise<UserResponse | null> {
    const result = await pool.query(
      'SELECT id, email, role, created_at FROM users WHERE id = $1',
      [userId]
    );

    return result.rows[0] || null;
  }

  async createUser(email: string, password: string, role: string = 'user'): Promise<UserResponse> {
    // Check if user exists
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existing.rows.length > 0) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role, created_at',
      [email, hashedPassword, role]
    );

    return result.rows[0];
  }

  async deleteUser(userId: number): Promise<boolean> {
    // Delete user (cascade will delete profile and files)
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1',
      [userId]
    );

    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getUserCount(): Promise<number> {
    const result = await pool.query('SELECT COUNT(*) FROM users');
    return parseInt(result.rows[0].count);
  }
}
