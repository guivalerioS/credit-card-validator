import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { buildApp } from '../../server';

describe('Card Validation API', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should validate a valid card number', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/validate',
      payload: {
        cardNumber: '4532015112830366'
      }
    });

    const result = JSON.parse(response.payload);
    expect(response.statusCode).toBe(200);
    expect(result.isValid).toBe(true);
  });

  it('should invalidate an incorrect card number', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/validate',
      payload: {
        cardNumber: '4532015112830367'
      }
    });

    const result = JSON.parse(response.payload);
    expect(response.statusCode).toBe(200);
    expect(result.isValid).toBe(false);
  });

  it('should handle invalid input format', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/validate',
      payload: {
        cardNumber: 'abc123'
      }
    });

    expect(response.statusCode).toBe(400);
  });
});