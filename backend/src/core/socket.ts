import { Server } from 'socket.io';
import { createLogger } from '../utils/logger';
import { AgentPresenceService } from '../modules/agents/agent.service';

const logger = createLogger('Socket');

export let io: Server;

export const initSocket = (server: Server) => {
  io = server;

  server.on('connection', (socket) => {
    logger.info('Client connected', { socketId: socket.id });

    socket.on('agent-status', async (payload: { agentId: string; status: string }) => {
      await AgentPresenceService.updateStatus(payload.agentId, payload.status);
      socket.broadcast.emit('agent-status-updated', payload);
    });

    socket.on('handover', (payload: { conversationId: string; agentId: string }) => {
      socket.broadcast.emit('handover', payload);
    });

    socket.on('disconnect', () => {
      logger.info('Client disconnected', { socketId: socket.id });
    });
  });
};
