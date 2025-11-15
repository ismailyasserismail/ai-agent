import { pool } from '../../config/database';

export const AnalyticsRepository = {
  async conversationCounts() {
    const total = await pool.query('SELECT COUNT(*) FROM conversations');
    const botHandled = await pool.query("SELECT COUNT(*) FROM conversations WHERE status <> 'human'");
    const humanHandled = await pool.query("SELECT COUNT(*) FROM conversations WHERE status = 'human'");
    return {
      total: parseInt(total.rows[0].count, 10),
      botHandled: parseInt(botHandled.rows[0].count, 10),
      humanHandled: parseInt(humanHandled.rows[0].count, 10),
    };
  },

  async satisfactionScores() {
    const result = await pool.query('SELECT rating, COUNT(*) as count FROM conversation_feedback GROUP BY rating');
    return result.rows.map((row) => ({ rating: row.rating, count: parseInt(row.count, 10) }));
  },

  async popularQuestions(limit = 5) {
    const result = await pool.query(
      `SELECT content, COUNT(*) as count
       FROM messages
       WHERE sender_type = 'user'
       GROUP BY content
       ORDER BY count DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows.map((row) => ({ question: row.content, count: parseInt(row.count, 10) }));
  },
};
