import request from 'supertest';
import express from 'express';
import { createUserHandler } from '../src/controllers/userController.js';
import { PrismaClient } from '@prisma/client';
import { describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';

const prisma = new PrismaClient();

// Configurar la app express para pruebas
const app = express();
app.use(express.json());
app.post('/api/users', createUserHandler);

describe('User Controller', () => {
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

  it('Debería crear un nuevo usuario', async () => {
    const newUser = {
      nombre: 'Test User',
      correo: 'test@example.com',
      contrasena: 'testpassword',
      rol: 'usuario'
    };

    const response = await request(app)
      .post('/api/users')
      .send(newUser);

    expect(response.status).toBe(201);
    expect(response.body.nombre).toBe(newUser.nombre);
    expect(response.body.correo).toBe(newUser.correo);
    expect(response.body.rol).toBe(newUser.rol);

    // Verificar que la contraseña esté encriptada
    const userInDb = await prisma.usuario.findUnique({ where: { correo: newUser.correo } });
    expect(userInDb).toBeTruthy();
    expect(userInDb.contrasena).not.toBe(newUser.contrasena);
  });

  it('Debería devolver un error si faltan campos requeridos', async () => {
    const incompleteUser = {
      nombre: 'Incomplete User',
      // Falta el campo correo y contrasena
    };

    const response = await request(app)
      .post('/api/users')
      .send(incompleteUser);

    expect(response.status).toBe(400); // Cambié a 400 Bad Request
    expect(response.body.error).toBe('Campos requeridos faltantes');
  });
});
