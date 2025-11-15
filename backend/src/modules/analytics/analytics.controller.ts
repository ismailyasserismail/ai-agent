import { Request, Response } from 'express';
import { AnalyticsService } from './analytics.service';

export const AnalyticsController = {
  async dashboard(_req: Request, res: Response) {
    const data = await AnalyticsService.dashboard();
    res.json(data);
  },
};
