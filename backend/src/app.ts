import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './modules/auth/auth.routes';
import chatbotRoutes from './modules/chatbot/chatbot.routes';
import conversationRoutes from './modules/conversations/conversation.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';
import agentRoutes from './modules/agents/agent.routes';
import knowledgeRoutes from './modules/knowledge/knowledge.routes';
import integrationRoutes from './modules/integrations/integration.routes';
import { swaggerUi, swaggerSpec } from './config/swagger';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/integrations', integrationRoutes);

app.use(errorHandler);

export default app;
