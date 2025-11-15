import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { KnowledgeService } from './knowledge.service';

export const KnowledgeController = {
  async listIntents(_req: Request, res: Response) {
    const intents = await KnowledgeService.listIntents();
    res.json({ intents });
  },

  async createIntent(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, fallback } = req.body;
    const intent = await KnowledgeService.createIntent({ name, description, fallback });
    res.status(201).json({ intent });
  },

  async updateIntent(req: Request, res: Response) {
    const { id } = req.params;
    const intent = await KnowledgeService.updateIntent(id, req.body);
    res.json({ intent });
  },

  async deleteIntent(req: Request, res: Response) {
    const { id } = req.params;
    await KnowledgeService.deleteIntent(id);
    res.status(204).send();
  },

  async listTrainingPhrases(req: Request, res: Response) {
    const { id } = req.params;
    const phrases = await KnowledgeService.listTrainingPhrases(id);
    res.json({ phrases });
  },

  async addTrainingPhrase(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { phrase, language } = req.body;
    const created = await KnowledgeService.addTrainingPhrase(id, phrase, language);
    res.status(201).json({ phrase: created });
  },

  async deleteTrainingPhrase(req: Request, res: Response) {
    const { phraseId } = req.params;
    await KnowledgeService.deleteTrainingPhrase(phraseId);
    res.status(204).send();
  },

  async listResponses(req: Request, res: Response) {
    const { id } = req.params;
    const responses = await KnowledgeService.listResponses(id);
    res.json({ responses });
  },

  async addResponse(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { responseText, language } = req.body;
    const created = await KnowledgeService.addResponse(id, responseText, language);
    res.status(201).json({ response: created });
  },

  async deleteResponse(req: Request, res: Response) {
    const { responseId } = req.params;
    await KnowledgeService.deleteResponse(responseId);
    res.status(204).send();
  },
};
