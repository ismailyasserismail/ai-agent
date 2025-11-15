import { pool } from '../../config/database';
import { Conversation, Message } from './conversation.types';

const mapConversation = (row: any): Conversation => ({
  id: row.id,
  userId: row.user_id,
  channel: row.channel,
  status: row.status,
  assignedAgentId: row.assigned_agent_id,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapMessage = (row: any): Message => ({
  id: row.id,
  conversationId: row.conversation_id,
  senderType: row.sender_type,
  senderId: row.sender_id,
  language: row.language,
  content: row.content,
  metadata: row.metadata,
  createdAt: row.created_at,
});

export const ConversationRepository = {
  async createConversation(params: { id: string; userId: string | null; channel: string; status: string }): Promise<Conversation> {
    const result = await pool.query(
      `INSERT INTO conversations (id, user_id, channel, status)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [params.id, params.userId, params.channel, params.status]
    );
    return mapConversation(result.rows[0]);
  },

  async updateStatus(id: string, status: string, assignedAgentId: string | null): Promise<Conversation> {
    const result = await pool.query(
      `UPDATE conversations SET status = $1, assigned_agent_id = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
      [status, assignedAgentId, id]
    );
    return mapConversation(result.rows[0]);
  },

  async getConversation(id: string): Promise<Conversation | null> {
    const result = await pool.query('SELECT * FROM conversations WHERE id = $1', [id]);
    return result.rows[0] ? mapConversation(result.rows[0]) : null;
  },

  async listConversations(limit: number, offset: number): Promise<Conversation[]> {
    const result = await pool.query('SELECT * FROM conversations ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, offset]);
    return result.rows.map(mapConversation);
  },

  async logMessage(params: {
    id: string;
    conversationId: string;
    senderType: string;
    senderId: string | null;
    content: string;
    language: string;
    metadata?: any;
  }): Promise<Message> {
    const result = await pool.query(
      `INSERT INTO messages (id, conversation_id, sender_type, sender_id, content, language, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [params.id, params.conversationId, params.senderType, params.senderId, params.content, params.language, params.metadata ?? null]
    );
    return mapMessage(result.rows[0]);
  },

  async listMessages(conversationId: string): Promise<Message[]> {
    const result = await pool.query('SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC', [conversationId]);
    return result.rows.map(mapMessage);
  },

  async countConversations(): Promise<number> {
    const result = await pool.query('SELECT COUNT(*) FROM conversations');
    return parseInt(result.rows[0].count, 10);
  },
};
