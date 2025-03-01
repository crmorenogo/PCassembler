import request from 'supertest';
import express from 'express';
import { getMotherBoards } from '../src/controllers/ensambleController.js';
import { PrismaClient } from '@prisma/client';
import { describe, it, expect, beforeAll, afterAll, afterEach, jest } from '@jest/globals';

const prisma = new PrismaClient();

// Configurar la app express para pruebas
const app = express();
app.get('/api/motherboards', getMotherBoards);

describe('getMotherBoards', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  afterEach(async () => {
    jest.clearAllMocks(); // Limpiar todos los mocks después de cada prueba
  });

  it('Debería obtener una lista de motherboards', async () => {
    const response = await request(app).get('/api/motherboards').send();
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('nombre');
  });
});
