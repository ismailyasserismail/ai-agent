import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ConversationService } from './conversation.service';

export const ConversationController = {
  async start(req: Request, res: Response) {
    const { userId, channel } = req.body;
    const conversation = await ConversationService.startConversation({ userId, channel });
    res.status(201).json({ conversation });
  },

  async list(req: Request, res: Response) {
    const limit = parseInt((req.query.limit as string) ?? '25', 10);
    const offset = parseInt((req.query.offset as string) ?? '0', 10);
    const conversations = await ConversationService.listConversations(limit, offset);
    res.json({ conversations });
  },

  async get(req: Request, res: Response) {
    const { id } = req.params;
    const conversation = await ConversationService.getConversation(id);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    const messages = await ConversationService.listMessages(id);
    res.json({ conversation, messages });
  },

  async handover(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { agentId } = req.body;
    const conversation = await ConversationService.switchToHuman(id, agentId);
    res.json({ conversation });
  },

  async returnToBot(req: Request, res: Response) {
    const { id } = req.params;
    const conversation = await ConversationService.switchToBot(id);
    res.json({ conversation });
  },

  async close(req: Request, res: Response) {
    const { id } = req.params;
    const conversation = await ConversationService.closeConversation(id);
    res.json({ conversation });
  },
};
