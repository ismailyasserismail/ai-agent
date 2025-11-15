import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../../middleware/authMiddleware';
import { AgentController } from './agent.controller';

const router = Router();

router.use(authenticate);
router.get('/', AgentController.list);
router.post('/', [body('agentId').notEmpty(), body('status').isIn(['online', 'offline', 'busy'])], AgentController.update);

export default router;
