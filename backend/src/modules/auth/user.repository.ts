import { PoolClient } from 'pg';
import { pool } from '../../config/database';
import { User } from './types';

const toUser = (row: any): User => ({
  id: row.id,
  email: row.email,
  passwordHash: row.password_hash,
  fullName: row.full_name,
  role: row.role,
  createdAt: row.created_at,
});

export const UserRepository = {
  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] ? toUser(result.rows[0]) : null;
  },

  async findById(id: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] ? toUser(result.rows[0]) : null;
  },

  async create(user: { id: string; email: string; passwordHash: string; fullName: string; role: string }, client?: PoolClient): Promise<User> {
    const executor = client ?? pool;
    const result = await executor.query(
      `INSERT INTO users (id, email, password_hash, full_name, role)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user.id, user.email, user.passwordHash, user.fullName, user.role]
    );
    return toUser(result.rows[0]);
  },
};
