import { v4 as uuid } from 'uuid';
import { KnowledgeRepository } from './knowledge.repository';
import { BotResponse, Intent, TrainingPhrase } from './knowledge.types';

export const KnowledgeService = {
  async listIntents(): Promise<Intent[]> {
    return KnowledgeRepository.listIntents();
  },

  async createIntent(payload: { name: string; description: string; fallback?: boolean }): Promise<Intent> {
    return KnowledgeRepository.createIntent({
      id: uuid(),
      name: payload.name,
      description: payload.description,
      fallback: payload.fallback ?? false,
    });
  },

  async updateIntent(id: string, payload: Partial<{ name: string; description: string; fallback: boolean }>): Promise<Intent> {
    return KnowledgeRepository.updateIntent(id, payload);
  },

  async deleteIntent(id: string): Promise<void> {
    return KnowledgeRepository.deleteIntent(id);
  },

  async listTrainingPhrases(intentId: string): Promise<TrainingPhrase[]> {
    return KnowledgeRepository.listPhrases(intentId);
  },

  async addTrainingPhrase(intentId: string, text: string, language: string): Promise<TrainingPhrase> {
    return KnowledgeRepository.addPhrase({
      id: uuid(),
      intentId,
      text,
      language,
    });
  },

  async deleteTrainingPhrase(id: string): Promise<void> {
    return KnowledgeRepository.deletePhrase(id);
  },

  async listResponses(intentId: string): Promise<BotResponse[]> {
    return KnowledgeRepository.listResponses(intentId);
  },

  async addResponse(intentId: string, text: string, language: string): Promise<BotResponse> {
    return KnowledgeRepository.addResponse({
      id: uuid(),
      intentId,
      text,
      language,
    });
  },

  async deleteResponse(id: string): Promise<void> {
    return KnowledgeRepository.deleteResponse(id);
  },
};
