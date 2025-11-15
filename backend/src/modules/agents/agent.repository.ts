import { pool } from '../../config/database';

interface AgentStatusRow {
  agent_id: string;
  status: string;
  updated_at: Date;
}

const mapRow = (row: AgentStatusRow) => ({
  agentId: row.agent_id,
  status: row.status,
  updatedAt: row.updated_at,
});

export const AgentRepository = {
  async upsertStatus(agentId: string, status: string) {
    const result = await pool.query(
      `INSERT INTO agent_status (agent_id, status)
       VALUES ($1, $2)
       ON CONFLICT (agent_id) DO UPDATE SET status = $2, updated_at = NOW()
       RETURNING *`,
      [agentId, status]
    );
    return mapRow(result.rows[0]);
  },

  async listStatuses() {
    const result = await pool.query('SELECT * FROM agent_status ORDER BY updated_at DESC');
    return result.rows.map(mapRow);
  },
};
