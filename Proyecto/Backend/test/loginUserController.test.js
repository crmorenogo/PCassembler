import request from 'supertest';
import express from 'express';
import { authenticateUserHandler } from '../src/controllers/userController.js';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'; // Importa bcrypt
import { describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';

const prisma = new PrismaClient();

// Configurar la app express para pruebas
const app = express();
app.use(express.json());
app.post('/api/login', authenticateUserHandler);

describe('Authentication Controller', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  afterEach(async () => {
    // Limpia la base de datos después de cada prueba
    await prisma.usuario.deleteMany();
  });

  it('Debería autenticar un usuario con credenciales correctas', async () => {
    // Crear un usuario de prueba en la base de datos
    const hashedPassword = await bcrypt.hash('testpassword', 10);
    const testUser = {
      nombre: 'Test User',
      correo: 'test@example.com',
      contrasena: hashedPassword,
      rol: 'usuario'
    };
    await prisma.usuario.create({ data: testUser });

    // Enviar una solicitud de inicio de sesión con las credenciales correctas
    const response = await request(app)
      .post('/api/login')
      .send({ correo: 'test@example.com', contrasena: 'testpassword' });

    expect(response.status).toBe(200);
    expect(response.body.correo).toBe(testUser.correo);
    expect(response.body.rol).toBe(testUser.rol);
  });

  it('Debería devolver un error si las credenciales son incorrectas', async () => {
    // Crear un usuario de prueba en la base de datos
    const hashedPassword = await bcrypt.hash('testpassword', 10);
    const testUser = {
      nombre: 'Test User',
      correo: 'test@example.com',
      contrasena: hashedPassword,
      rol: 'usuario'
    };
    await prisma.usuario.create({ data: testUser });

    // Enviar una solicitud de inicio de sesión con una contraseña incorrecta
    const response = await request(app)
      .post('/api/login')
      .send({ correo: 'test@example.com', contrasena: 'wrongpassword' });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Authentication failed');
  });

  it('Debería devolver un error si falta el campo correo', async () => {
    // Enviar una solicitud de inicio de sesión sin el campo correo
    const response = await request(app)
      .post('/api/login')
      .send({ contrasena: 'testpassword' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Campos requeridos faltantes');
  });

  it('Debería devolver un error si falta el campo contrasena', async () => {
    // Enviar una solicitud de inicio de sesión sin el campo contrasena
    const response = await request(app)
      .post('/api/login')
      .send({ correo: 'test@example.com' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Campos requeridos faltantes');
  });
});
