import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../core/httpError';

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof HttpError) {
    res.status(error.status).json({ message: error.message, details: error.details });
    return;
  }

  console.error('Unhandled error', error);
  res.status(500).json({ message: 'Internal server error' });
}
