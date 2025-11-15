import { Card, CardContent, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { AnalyticsDashboard } from '../types/api';

export default function DashboardPage() {
  const [data, setData] = useState<AnalyticsDashboard | null>(null);

  useEffect(() => {
    async function fetchData() {
      const { data } = await apiClient.get('/analytics/dashboard');
      setData(data);
    }
    fetchData();
  }, []);

  if (!data) {
    return null;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Total Conversations</Typography>
            <Typography variant="h3">{data.counts.total}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Bot Success Rate</Typography>
            <Typography variant="h3">{data.successRate}%</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">User Satisfaction</Typography>
            <Typography variant="h3">{data.satisfactionRate}%</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">Popular Questions</Typography>
            {data.popularQuestions.map((item) => (
              <Typography key={item.question}>{item.question} – {item.count}</Typography>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
