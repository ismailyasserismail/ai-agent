import { createLogger } from '../../utils/logger';

const logger = createLogger('MockCRM');

export interface CrmContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  tags: string[];
}

const mockContacts: CrmContact[] = [
  { id: 'crm-1', name: 'أحمد السبيعي', email: 'ahmed@example.com', phone: '+966500000001', tags: ['vip', 'arabic'] },
  { id: 'crm-2', name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+966500000002', tags: ['english'] },
];

export const MockCrmService = {
  async findContactByEmail(email: string): Promise<CrmContact | null> {
    logger.info('Searching CRM for contact', { email });
    return mockContacts.find((contact) => contact.email === email) ?? null;
  },

  async createTicket(payload: { subject: string; description: string; email: string }): Promise<{ ticketId: string }> {
    logger.info('Creating CRM ticket', payload);
    return { ticketId: `TICKET-${Date.now()}` };
  },
};
