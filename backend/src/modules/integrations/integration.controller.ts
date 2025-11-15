import { Request, Response } from 'express';
import { MockCrmService } from './crm.service';
import { MockOrderService } from './order.service';

export const IntegrationController = {
  async crmContact(req: Request, res: Response) {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const contact = await MockCrmService.findContactByEmail(email as string);
    res.json({ contact });
  },

  async createTicket(req: Request, res: Response) {
    const { subject, description, email } = req.body;
    const ticket = await MockCrmService.createTicket({ subject, description, email });
    res.status(201).json(ticket);
  },

  async orderStatus(req: Request, res: Response) {
    const { orderId } = req.params;
    const order = await MockOrderService.getOrderStatus(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ order });
  },
};
