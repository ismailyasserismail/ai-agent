export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'agent';
}

export interface ConversationSummary {
  id: string;
  channel: string;
  status: string;
  assignedAgentId: string | null;
  createdAt: string;
}

export interface Message {
  id: string;
  senderType: 'user' | 'bot' | 'agent';
  content: string;
  language: string;
  createdAt: string;
}

export interface AnalyticsDashboard {
  counts: {
    total: number;
    botHandled: number;
    humanHandled: number;
  };
  satisfactionRate: number;
  successRate: number;
  popularQuestions: { question: string; count: number }[];
}
