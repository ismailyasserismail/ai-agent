import { Box, Card, CardContent, Chip, Grid, Typography } from '@mui/material';

const integrations = [
  {
    name: 'Web Widget',
    description: 'Embed the chatbot widget on any website using the provided script tag.',
    status: 'Enabled',
  },
  {
    name: 'Mobile SDK',
    description: 'Use the React Native SDK to integrate the chatbot into mobile apps.',
    status: 'Enabled',
  },
  {
    name: 'WhatsApp Business',
    description: 'Connect via WhatsApp Business API (disabled by default).',
    status: 'Disabled',
  },
  {
    name: 'Instagram Messaging',
    description: 'Respond to Instagram DMs programmatically (disabled by default).',
    status: 'Disabled',
  },
];

export default function IntegrationsPage() {
  return (
    <Grid container spacing={3}>
      {integrations.map((integration) => (
        <Grid item xs={12} md={6} key={integration.name}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">{integration.name}</Typography>
                <Chip color={integration.status === 'Enabled' ? 'success' : 'default'} label={integration.status} />
              </Box>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {integration.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
