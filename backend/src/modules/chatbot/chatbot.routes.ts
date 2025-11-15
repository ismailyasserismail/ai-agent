import { Router } from 'express';
import { body } from 'express-validator';
import { ChatbotController } from './chatbot.controller';

const router = Router();

router.post(
  '/message',
  /**
   * @openapi
   * /chatbot/message:
   *   post:
   *     tags:
   *       - Chatbot
   *     summary: Send a message to the chatbot
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [channel, message, language]
   *             properties:
   *               conversationId: { type: string }
   *               channel: { type: string, enum: [web, mobile, whatsapp, instagram] }
   *               message: { type: string }
   *               language: { type: string, enum: [en, ar] }
   *               userEmail: { type: string }
   *     responses:
   *       200:
   *         description: Chatbot response
   */
  [
    body('channel').isIn(['web', 'mobile', 'whatsapp', 'instagram']),
    body('message').notEmpty(),
    body('language').isIn(['en', 'ar']),
  ],
  ChatbotController.handle
);

export default router;
