import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../modules/auth/auth.service';
import { UnauthorizedError } from '../core/httpError';

export interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string; email: string };
}

export const authenticate = async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header) {
    throw new UnauthorizedError();
  }

  const token = header.replace('Bearer ', '');
  try {
    const payload = await AuthService.verify(token);
    req.user = { id: payload.sub, role: payload.role, email: payload.email };
    next();
  } catch (error) {
    throw new UnauthorizedError();
  }
};

export const authorize = (roles: string[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new UnauthorizedError();
    }
    next();
  };
};
