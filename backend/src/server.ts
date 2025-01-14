import Fastify, { FastifyInstance } from 'fastify';
import fastifyCors from '@fastify/cors';
import { validateCreditCard } from './services/cardValidator';

interface ICardValidationBody {
  cardNumber: string;
}

const cardValidationSchema = {
  body: {
    type: 'object',
    required: ['cardNumber'],
    properties: {
      cardNumber: {
        type: 'string',
        minLength: 13,
        maxLength: 19,
        pattern: '^\\d+$'
      }
    }
  }
};

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: true
  });

  await app.register(fastifyCors, {
    origin: 'http://localhost:5173'
  });

  app.post<{
    Body: ICardValidationBody;
  }>('/api/validate', {
    schema: cardValidationSchema,
    handler: async (request, reply) => {
      const { cardNumber } = request.body;
      const isValid = validateCreditCard(cardNumber);
      
      return { isValid };
    }
  });

  return app;
}

export async function startServer() {
  try {
    const app = await buildApp();
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
    
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`Servidor rodando em http://localhost:${port}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}