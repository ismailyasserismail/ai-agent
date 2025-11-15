import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { env } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart Chatbot API',
      version: '1.0.0',
      description: 'API documentation for the Smart Chatbot platform',
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}/api`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['src/modules/**/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
export { swaggerUi };
