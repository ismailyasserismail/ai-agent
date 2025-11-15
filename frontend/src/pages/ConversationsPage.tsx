import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { ConversationSummary, Message } from '../types/api';

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selected, setSelected] = useState<ConversationSummary | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    async function fetchConversations() {
      const { data } = await apiClient.get('/conversations');
      setConversations(data.conversations);
    }
    fetchConversations();
  }, []);

  const openConversation = async (conversation: ConversationSummary) => {
    setSelected(conversation);
    const { data } = await apiClient.get(`/conversations/${conversation.id}`);
    setMessages(data.messages);
  };

  const closeHandover = async () => {
    if (!selected) return;
    await apiClient.post(`/conversations/${selected.id}/return-to-bot`);
    setSelected(null);
    setMessages([]);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">Conversations</Typography>
            <List>
              {conversations.map((conversation) => (
                <ListItem key={conversation.id} disablePadding>
                  <ListItemButton onClick={() => openConversation(conversation)}>
                    <ListItemText
                      primary={`#${conversation.id.slice(0, 8)} – ${conversation.channel}`}
                      secondary={`Status: ${conversation.status}`}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
      <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} fullWidth maxWidth="md">
        <DialogTitle>Conversation details</DialogTitle>
        <DialogContent dividers>
          {messages.map((message) => (
            <Typography key={message.id} sx={{ mb: 1 }}>
              <strong>{message.senderType.toUpperCase()}</strong>: {message.content}
            </Typography>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeHandover}>Return to bot</Button>
          <Button onClick={() => setSelected(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
