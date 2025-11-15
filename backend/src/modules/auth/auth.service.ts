import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { env } from '../../config/env';
import { HttpError, UnauthorizedError } from '../../core/httpError';
import { UserRepository } from './user.repository';
import { User } from './types';

interface AuthTokenPayload {
  sub: string;
  role: string;
  email: string;
}

const sanitizeUser = (user: User) => ({
  id: user.id,
  email: user.email,
  fullName: user.fullName,
  role: user.role,
  createdAt: user.createdAt,
});

export const AuthService = {
  async register(params: { email: string; password: string; fullName: string; role: 'admin' | 'agent' }): Promise<ReturnType<typeof sanitizeUser>> {
    const existing = await UserRepository.findByEmail(params.email);
    if (existing) {
      throw new HttpError(409, 'Email already registered');
    }

    const passwordHash = await bcrypt.hash(params.password, 10);
    const user = await UserRepository.create({
      id: uuid(),
      email: params.email,
      passwordHash,
      fullName: params.fullName,
      role: params.role,
    });

    return sanitizeUser(user);
  },

  async login(email: string, password: string): Promise<{ token: string; user: ReturnType<typeof sanitizeUser> }> {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const payload: AuthTokenPayload = {
      sub: user.id,
      role: user.role,
      email: user.email,
    };

    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: '12h' });

    return { token, user: sanitizeUser(user) };
  },

  async verify(token: string): Promise<AuthTokenPayload> {
    return jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
  },

  sanitizeUser,
};
