import { v4 as uuid } from 'uuid';
import { ConversationRepository } from './conversation.repository';
import { Conversation, Message } from './conversation.types';

export const ConversationService = {
  async startConversation(params: { userId?: string | null; channel: Conversation['channel'] }): Promise<Conversation> {
    return ConversationRepository.createConversation({
      id: uuid(),
      userId: params.userId ?? null,
      channel: params.channel,
      status: 'bot',
    });
  },

  async appendMessage(params: {
    conversationId: string;
    senderType: Message['senderType'];
    senderId?: string | null;
    content: string;
    language: string;
    metadata?: any;
  }): Promise<Message> {
    return ConversationRepository.logMessage({
      id: uuid(),
      conversationId: params.conversationId,
      senderType: params.senderType,
      senderId: params.senderId ?? null,
      content: params.content,
      language: params.language,
      metadata: params.metadata,
    });
  },

  async getConversation(conversationId: string): Promise<Conversation | null> {
    return ConversationRepository.getConversation(conversationId);
  },

  async switchToHuman(conversationId: string, agentId: string | null): Promise<Conversation> {
    return ConversationRepository.updateStatus(conversationId, 'human', agentId);
  },

  async switchToBot(conversationId: string): Promise<Conversation> {
    return ConversationRepository.updateStatus(conversationId, 'bot', null);
  },

  async closeConversation(conversationId: string): Promise<Conversation> {
    return ConversationRepository.updateStatus(conversationId, 'closed', null);
  },

  async listConversations(limit = 25, offset = 0): Promise<Conversation[]> {
    return ConversationRepository.listConversations(limit, offset);
  },

  async listMessages(conversationId: string): Promise<Message[]> {
    return ConversationRepository.listMessages(conversationId);
  },

  async countConversations(): Promise<number> {
    return ConversationRepository.countConversations();
  },
};
