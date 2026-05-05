import bcrypt from 'bcryptjs';
import { pool } from '../config/database';
import { generateToken } from '../config/jwt';
import { User, UserResponse, AuthResponse } from '../types';

export class AuthService {
  async register(email: string, password: string, role: string = 'user'): Promise<UserResponse> {
    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role, created_at',
      [email, hashedPassword, role]
    );

    return result.rows[0];
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    // Find user
    const result = await pool.query(
      'SELECT id, email, password_hash, role FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      throw new Error('Invalid email or password');
    }

    const user: User = result.rows[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    // Return token and user info (without password)
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        created_at: user.created_at
      }
    };
  }

  async getUserById(userId: number): Promise<UserResponse | null> {
    const result = await pool.query(
      'SELECT id, email, role, created_at FROM users WHERE id = $1',
      [userId]
    );

    return result.rows[0] || null;
  }
}
