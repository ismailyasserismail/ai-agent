import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ChatbotService } from './chatbot.service';

export const ChatbotController = {
  async handle(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { conversationId, channel, message, language, metadata, userEmail } = req.body;
    const response = await ChatbotService.handleMessage({
      conversationId,
      channel,
      message,
      language,
      metadata,
      userEmail,
    });
    res.json(response);
  },
};
