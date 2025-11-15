import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, List, ListItem, ListItemButton, ListItemText, TextField, Typography } from '@mui/material';
import { FormEvent, useEffect, useState } from 'react';
import { apiClient } from '../api/client';

interface Intent {
  id: string;
  name: string;
  description: string;
}

interface Phrase {
  id: string;
  phrase: string;
  language: string;
}

interface ResponseItem {
  id: string;
  responseText: string;
  language: string;
}

export default function KnowledgePage() {
  const [intents, setIntents] = useState<Intent[]>([]);
  const [selected, setSelected] = useState<Intent | null>(null);
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [responses, setResponses] = useState<ResponseItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newIntent, setNewIntent] = useState({ name: '', description: '' });

  useEffect(() => {
    async function fetchIntents() {
      const { data } = await apiClient.get('/knowledge');
      setIntents(data.intents);
    }
    fetchIntents();
  }, []);

  const openIntent = async (intent: Intent) => {
    setSelected(intent);
    const phrasesResponse = await apiClient.get(`/knowledge/${intent.id}/phrases`);
    setPhrases(phrasesResponse.data.phrases);
    const responsesResponse = await apiClient.get(`/knowledge/${intent.id}/responses`);
    setResponses(responsesResponse.data.responses);
  };

  const createIntent = async (event: FormEvent) => {
    event.preventDefault();
    const { data } = await apiClient.post('/knowledge', newIntent);
    setIntents([data.intent, ...intents]);
    setDialogOpen(false);
    setNewIntent({ name: '', description: '' });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Intents</Typography>
              <Button onClick={() => setDialogOpen(true)}>Add</Button>
            </Box>
            <List>
              {intents.map((intent) => (
                <ListItem key={intent.id} disablePadding>
                  <ListItemButton onClick={() => openIntent(intent)}>
                    <ListItemText primary={intent.name} secondary={intent.description} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={8}>
        {selected ? (
          <Card>
            <CardContent>
              <Typography variant="h6">{selected.name}</Typography>
              <Typography variant="subtitle2" gutterBottom>
                Training Phrases
              </Typography>
              {phrases.map((phrase) => (
                <Typography key={phrase.id}>
                  [{phrase.language}] {phrase.phrase}
                </Typography>
              ))}
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                Responses
              </Typography>
              {responses.map((response) => (
                <Typography key={response.id}>
                  [{response.language}] {response.responseText}
                </Typography>
              ))}
            </CardContent>
          </Card>
        ) : (
          <Typography>Select an intent to view details.</Typography>
        )}
      </Grid>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Create intent</DialogTitle>
        <Box component="form" onSubmit={createIntent}>
          <DialogContent>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              value={newIntent.name}
              onChange={(event) => setNewIntent({ ...newIntent, name: event.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              margin="normal"
              value={newIntent.description}
              onChange={(event) => setNewIntent({ ...newIntent, description: event.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit">Create</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Grid>
  );
}
