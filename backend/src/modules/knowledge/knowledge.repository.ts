import { pool } from '../../config/database';
import { BotResponse, Intent, TrainingPhrase } from './knowledge.types';

const mapIntent = (row: any): Intent => ({
  id: row.id,
  name: row.name,
  description: row.description,
  fallback: row.fallback,
  createdAt: row.created_at,
});

const mapPhrase = (row: any): TrainingPhrase => ({
  id: row.id,
  intentId: row.intent_id,
  phrase: row.phrase,
  language: row.language,
});

const mapResponse = (row: any): BotResponse => ({
  id: row.id,
  intentId: row.intent_id,
  responseText: row.response_text,
  language: row.language,
});

export const KnowledgeRepository = {
  async listIntents(): Promise<Intent[]> {
    const result = await pool.query('SELECT * FROM bot_intents ORDER BY created_at DESC');
    return result.rows.map(mapIntent);
  },

  async getIntent(id: string): Promise<Intent | null> {
    const result = await pool.query('SELECT * FROM bot_intents WHERE id = $1', [id]);
    return result.rows[0] ? mapIntent(result.rows[0]) : null;
  },

  async createIntent(intent: { id: string; name: string; description: string; fallback: boolean }): Promise<Intent> {
    const result = await pool.query(
      `INSERT INTO bot_intents (id, name, description, fallback)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [intent.id, intent.name, intent.description, intent.fallback]
    );
    return mapIntent(result.rows[0]);
  },

  async updateIntent(id: string, updates: Partial<Omit<Intent, 'id' | 'createdAt'>>): Promise<Intent> {
    const fields = [] as string[];
    const values = [] as any[];
    let index = 1;

    if (updates.name) {
      fields.push(`name = $${index++}`);
      values.push(updates.name);
    }

    if (updates.description) {
      fields.push(`description = $${index++}`);
      values.push(updates.description);
    }

    if (typeof updates.fallback === 'boolean') {
      fields.push(`fallback = $${index++}`);
      values.push(updates.fallback);
    }

    if (fields.length === 0) {
      const current = await KnowledgeRepository.getIntent(id);
      if (!current) {
        throw new Error('Intent not found');
      }
      return current;
    }

    values.push(id);
    const result = await pool.query(`UPDATE bot_intents SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`, values);
    return mapIntent(result.rows[0]);
  },

  async deleteIntent(id: string): Promise<void> {
    await pool.query('DELETE FROM bot_intents WHERE id = $1', [id]);
  },

  async listPhrases(intentId: string): Promise<TrainingPhrase[]> {
    const result = await pool.query('SELECT * FROM training_phrases WHERE intent_id = $1', [intentId]);
    return result.rows.map(mapPhrase);
  },

  async addPhrase(phrase: { id: string; intentId: string; text: string; language: string }): Promise<TrainingPhrase> {
    const result = await pool.query(
      `INSERT INTO training_phrases (id, intent_id, phrase, language)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [phrase.id, phrase.intentId, phrase.text, phrase.language]
    );
    return mapPhrase(result.rows[0]);
  },

  async deletePhrase(id: string): Promise<void> {
    await pool.query('DELETE FROM training_phrases WHERE id = $1', [id]);
  },

  async listResponses(intentId: string): Promise<BotResponse[]> {
    const result = await pool.query('SELECT * FROM bot_responses WHERE intent_id = $1', [intentId]);
    return result.rows.map(mapResponse);
  },

  async addResponse(response: { id: string; intentId: string; text: string; language: string }): Promise<BotResponse> {
    const result = await pool.query(
      `INSERT INTO bot_responses (id, intent_id, response_text, language)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [response.id, response.intentId, response.text, response.language]
    );
    return mapResponse(result.rows[0]);
  },

  async deleteResponse(id: string): Promise<void> {
    await pool.query('DELETE FROM bot_responses WHERE id = $1', [id]);
  },
};
