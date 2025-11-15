import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../../middleware/authMiddleware';
import { ConversationController } from './conversation.controller';

const router = Router();

router.post('/', authenticate, ConversationController.start);
router.get('/', authenticate, ConversationController.list);
router.get('/:id', authenticate, ConversationController.get);
router.post('/:id/handover', authenticate, [body('agentId').notEmpty()], ConversationController.handover);
router.post('/:id/return-to-bot', authenticate, ConversationController.returnToBot);
router.post('/:id/close', authenticate, ConversationController.close);

export default router;
