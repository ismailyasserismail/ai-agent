import { KnowledgeService } from '../knowledge/knowledge.service';
import { matchIntent } from './nlp';
import { ConversationService } from '../conversations/conversation.service';
import { MockCrmService } from '../integrations/crm.service';
import { MockOrderService } from '../integrations/order.service';
import { env } from '../../config/env';

interface ChatRequest {
  conversationId?: string;
  channel: 'web' | 'mobile' | 'whatsapp' | 'instagram';
  message: string;
  language: 'en' | 'ar';
  userEmail?: string;
  metadata?: any;
}

export const ChatbotService = {
  async handleMessage(payload: ChatRequest) {
    if (payload.channel === 'whatsapp' && !env.ENABLE_WHATSAPP) {
      return {
        conversationId: payload.conversationId ?? null,
        response: 'WhatsApp integration is disabled.',
        intent: 'channel_disabled',
        confidence: 0,
      };
    }

    if (payload.channel === 'instagram' && !env.ENABLE_INSTAGRAM) {
      return {
        conversationId: payload.conversationId ?? null,
        response: 'Instagram messaging is disabled.',
        intent: 'channel_disabled',
        confidence: 0,
      };
    }

    const intents = await KnowledgeService.listIntents();
    const allPhrases = await Promise.all(intents.map((intent) => KnowledgeService.listTrainingPhrases(intent.id)));
    const allResponses = await Promise.all(intents.map((intent) => KnowledgeService.listResponses(intent.id)));
    const flattenedPhrases = allPhrases.flat();
    const flattenedResponses = allResponses.flat();

    let conversationId = payload.conversationId;
    if (!conversationId) {
      const conversation = await ConversationService.startConversation({ channel: payload.channel });
      conversationId = conversation.id;
    }

    await ConversationService.appendMessage({
      conversationId,
      senderType: 'user',
      content: payload.message,
      language: payload.language,
      metadata: payload.metadata,
    });

    const intentMatch = matchIntent(payload.message, intents, flattenedPhrases, flattenedResponses, payload.language);

    if (intentMatch) {
      const responseText = await processBusinessLogic(intentMatch.intent.name, payload, intentMatch.response?.responseText);
      await ConversationService.appendMessage({
        conversationId,
        senderType: 'bot',
        content: responseText,
        language: payload.language,
      });
      return { conversationId, response: responseText, intent: intentMatch.intent.name, confidence: intentMatch.score };
    }

    const fallbackIntent = intents.find((intent) => intent.fallback);
    const fallbackResponse = fallbackIntent
      ? flattenedResponses.find((response) => response.intentId === fallbackIntent.id && response.language === payload.language)
      : null;

    const fallbackText =
      fallbackResponse?.responseText ??
      (payload.language === 'ar'
        ? 'ما فهمتك زين. بحول المحادثة لأحد الزملاء يساعدك.'
        : "I'm not sure I understood. I'll escalate this chat to a human agent.");

    await ConversationService.switchToHuman(conversationId, null);
    await ConversationService.appendMessage({
      conversationId,
      senderType: 'bot',
      content: fallbackText,
      language: payload.language,
    });

    return { conversationId, response: fallbackText, intent: 'fallback', confidence: 0 };
  },
};

async function processBusinessLogic(intentName: string, payload: ChatRequest, defaultResponse?: string): Promise<string> {
  switch (intentName) {
    case 'order_status': {
      if (!payload.metadata?.orderId) {
        return payload.language === 'ar'
          ? 'وش رقم الطلب حقك؟'
          : 'Could you provide your order number?';
      }
      const order = await MockOrderService.getOrderStatus(payload.metadata.orderId);
      if (!order) {
        return payload.language === 'ar' ? 'ما حصلت الطلب.' : 'I could not find that order.';
      }
      return payload.language === 'ar'
        ? `طلبك ${order.orderId} حالته ${order.status} وبيوصلك بتاريخ ${order.eta}.`
        : `Your order ${order.orderId} is currently ${order.status} and will arrive by ${order.eta}.`;
    }
    case 'create_ticket': {
      if (!payload.userEmail) {
        return payload.language === 'ar'
          ? 'عطني بريدك الإلكتروني عشان أتابع معك.'
          : 'Please share your email so I can log a ticket for you.';
      }
      const ticket = await MockCrmService.createTicket({
        subject: `Support request from ${payload.userEmail}`,
        description: payload.message,
        email: payload.userEmail,
      });
      return payload.language === 'ar'
        ? `انفتح لك تذكرة دعم رقم ${ticket.ticketId}. فريقنا بيتواصل معك قريب.`
        : `Support ticket ${ticket.ticketId} has been created. Our team will reach out soon.`;
    }
    case 'greeting':
    case 'booking_request':
    case 'service_info':
    default:
      return defaultResponse ?? payload.message;
  }
}
