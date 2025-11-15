import { Router } from 'express';
import { authenticate } from '../../middleware/authMiddleware';
import { AnalyticsController } from './analytics.controller';

const router = Router();

router.use(authenticate);
router.get('/dashboard', AnalyticsController.dashboard);

export default router;
