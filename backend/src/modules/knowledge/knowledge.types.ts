export interface Intent {
  id: string;
  name: string;
  description: string;
  fallback: boolean;
  createdAt: Date;
}

export interface TrainingPhrase {
  id: string;
  intentId: string;
  phrase: string;
  language: string;
}

export interface BotResponse {
  id: string;
  intentId: string;
  responseText: string;
  language: string;
}
