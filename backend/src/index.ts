import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app';
import { env } from './config/env';
import { initSocket } from './core/socket';

const port = env.PORT;

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: env.CORS_ORIGIN,
    credentials: true,
  },
});

initSocket(io);

server.listen(port, () => {
  console.log(`Smart Chatbot backend listening on port ${port}`);
});
