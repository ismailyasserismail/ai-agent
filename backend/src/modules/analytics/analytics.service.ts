import { AnalyticsRepository } from './analytics.repository';

export const AnalyticsService = {
  async dashboard() {
    const [counts, satisfaction, popularQuestions] = await Promise.all([
      AnalyticsRepository.conversationCounts(),
      AnalyticsRepository.satisfactionScores(),
      AnalyticsRepository.popularQuestions(),
    ]);

    const totalFeedback = satisfaction.reduce((acc, entry) => acc + entry.count, 0);
    const positive = satisfaction.find((entry) => entry.rating === 1)?.count ?? 0;
    const successRate = counts.total > 0 ? Math.round((counts.botHandled / counts.total) * 100) : 0;
    const satisfactionRate = totalFeedback > 0 ? Math.round((positive / totalFeedback) * 100) : 0;

    return {
      counts,
      satisfactionRate,
      successRate,
      popularQuestions,
    };
  },
};
