/* eslint-disable no-undef */
import request from 'supertest';
import express from 'express';
import { getCPUsCompatibles } from '../src/controllers/assemblerController.js';
import { PrismaClient } from '@prisma/client';
import { describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';

const prisma = new PrismaClient();

// Configurar la app express para pruebas
const app = express();
app.use(express.json());
app.post('/api/cpus-compatibles', getCPUsCompatibles);

describe('getCPUsCompatibles', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  afterEach(async () => {
    jest.clearAllMocks(); // Limpiar todos los mocks después de cada prueba
  });

  it('Debería obtener CPUs compatibles con una motherboard válida', async () => {
    const motherboardId = 10122; // Usar un ID válido existente en tu base de datos

    const response = await request(app)
      .post('/api/cpus-compatibles')
      .send({ motherboardId });

    expect(response.status).toBe(200);
    expect(response.body.cpusCompatibles.length).toBeGreaterThan(0); // Suponemos que hay CPUs compatibles
  });

  it('Debería devolver un error si el ID de la motherboard no es válido', async () => {
    const response = await request(app)
      .post('/api/cpus-compatibles')
      .send({ motherboardId: 'invalid-id' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('❌ ID de motherboard no válido');
  });

  it('Debería devolver un error si el ID de la motherboard no existe', async () => {
    const motherboardId = 99999; // Usar un ID que no exista en tu base de datos

    const response = await request(app)
      .post('/api/cpus-compatibles')
      .send({ motherboardId });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('❌ Motherboard no encontrada');
  });
});
