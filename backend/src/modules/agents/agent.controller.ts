import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AgentPresenceService } from './agent.service';

export const AgentController = {
  async list(_req: Request, res: Response) {
    const agents = await AgentPresenceService.listStatuses();
    res.json({ agents });
  },

  async update(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { agentId, status } = req.body;
    const agent = await AgentPresenceService.updateStatus(agentId, status);
    res.json({ agent });
  },
};
