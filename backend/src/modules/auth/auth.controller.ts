import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';

export const AuthController = {
  async register(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, fullName, role } = req.body;
    const user = await AuthService.register({ email, password, fullName, role });
    res.status(201).json({ user });
  },

  async login(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    res.json(result);
  },

  async me(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await UserRepository.findById(req.user.id);
    res.json({ user: user ? AuthService.sanitizeUser(user) : null });
  },
};
