import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError('Unable to login. Please check your credentials.');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 12 }}>
      <Typography variant="h4" gutterBottom>
        Smart Chatbot Admin
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          margin="normal"
          fullWidth
          value={form.email}
          onChange={(event) => {
            setError('');
            setForm({ ...form, email: event.target.value });
          }}
        />
        <TextField
          label="Password"
          type="password"
          margin="normal"
          fullWidth
          value={form.password}
          onChange={(event) => {
            setError('');
            setForm({ ...form, password: event.target.value });
          }}
        />
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit" disabled={loading}>
          Login
        </Button>
      </Box>
    </Container>
  );
}
