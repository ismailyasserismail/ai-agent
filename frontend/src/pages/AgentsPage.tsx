import { Card, CardContent, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { apiClient } from '../api/client';

interface AgentStatus {
  agentId: string;
  status: string;
  updatedAt: string;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentStatus[]>([]);

  useEffect(() => {
    async function fetchAgents() {
      const { data } = await apiClient.get('/agents');
      setAgents(data.agents);
    }
    fetchAgents();
  }, []);

  const updateStatus = async (agentId: string, status: string) => {
    await apiClient.post('/agents', { agentId, status });
    setAgents((prev) => prev.map((agent) => (agent.agentId === agentId ? { ...agent, status } : agent)));
  };

  return (
    <Grid container spacing={3}>
      {agents.map((agent) => (
        <Grid item xs={12} md={4} key={agent.agentId}>
          <Card>
            <CardContent>
              <Typography variant="h6">Agent {agent.agentId.slice(0, 8)}</Typography>
              <Typography variant="body2" gutterBottom>
                Updated at {new Date(agent.updatedAt).toLocaleString()}
              </Typography>
              <TextField
                select
                label="Status"
                fullWidth
                value={agent.status}
                onChange={(event) => updateStatus(agent.agentId, event.target.value)}
              >
                <MenuItem value="online">Online</MenuItem>
                <MenuItem value="offline">Offline</MenuItem>
                <MenuItem value="busy">Busy</MenuItem>
              </TextField>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
