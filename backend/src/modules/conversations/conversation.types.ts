export type ConversationStatus = 'bot' | 'human' | 'closed';

export interface Conversation {
  id: string;
  userId: string | null;
  channel: 'web' | 'mobile' | 'whatsapp' | 'instagram';
  status: ConversationStatus;
  assignedAgentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderType: 'user' | 'bot' | 'agent';
  senderId: string | null;
  language: string;
  content: string;
  metadata?: any;
  createdAt: Date;
}
