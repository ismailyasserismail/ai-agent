import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from './auth.controller';
import { authenticate } from '../../middleware/authMiddleware';

const router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, fullName, role]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *               fullName: { type: string }
 *               role: { type: string, enum: [admin, agent] }
 *     responses:
 *       201:
 *         description: Created
 */
router.post(
  '/register',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('fullName').notEmpty(),
    body('role').isIn(['admin', 'agent']),
  ],
  AuthController.register
);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login
 */
router.post(
  '/login',
  [body('email').isEmail(), body('password').isLength({ min: 6 })],
  AuthController.login
);

router.get('/me', authenticate, AuthController.me);

export default router;
