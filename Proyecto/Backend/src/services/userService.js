/* eslint-disable no-undef */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno desde el archivo .env

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET; // Usar JWT_SECRET desde el archivo .env

// Función para crear un nuevo usuario
export async function createUser(nombre, correo, contrasena, rol = 'usuario') {
  try {
    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, SALT_ROUNDS);
    const newUser = await prisma.usuario.create({
      data: {
        nombre,
        correo,
        contrasena: hashedPassword,
        rol,
      },
    });
    console.log('User created successfully:', newUser);
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}


// Función para autenticar un usuario
export async function authenticateUser(correo, contrasena) {
  try {
    if (!correo || !contrasena) {
      throw new Error('Campos requeridos faltantes');
    }

    const user = await prisma.usuario.findUnique({
      where: { correo },
    });

    if (!user) {
      console.error('User not found');
      return null;
    }

    const isMatch = await bcrypt.compare(contrasena, user.contrasena);

    if (isMatch) {
      // Generar el token JWT con el ID y rol del usuario
      const token = jwt.sign(
        { id: user.id, correo: user.correo, rol: user.rol },
        JWT_SECRET,
        { expiresIn: '2h' } // El token expira en 2 horas
      );

      console.log('Authentication successful:', user);

      // Retornar el usuario junto con el token
      return { user, token };
    } else {
      console.error('Password does not match');
      return null;
    }
  } catch (error) {
    console.error('Error authenticating user:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Configurar el transporte de correo
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Proveedor de correo (puede ser Gmail, Outlook, etc.)
  auth: {
    user: process.env.EMAIL_USER, // Tu dirección de correo electrónico
    pass: process.env.EMAIL_PASS, // La contraseña de tu correo electrónico
  },
});

// Función para generar token de restablecimiento de contraseña
export async function generatePasswordResetToken(correo) {
  try {
    const token = jwt.sign({ correo }, JWT_SECRET, { expiresIn: '1h' }); // Token expira en 1 hora
    await prisma.usuario.update({
      where: { correo },
      data: { resetToken: token },
    });
    return token;
  } catch (error) {
    console.error('Error generating password reset token:', error);
    throw error;
  }
}

// Función para enviar correo electrónico de restablecimiento de contraseña
export async function sendPasswordResetEmail(correo, token) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: correo,
      subject: 'Restablecimiento de contraseña',
      text: `Haz clic en el siguiente enlace para restablecer tu contraseña: http://localhost:3001/reset-password?token=${token}`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent');
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
}

// Función para restablecer la contraseña
export async function resetPassword(correo, nuevaContrasena) {
  try {
    const hashedPassword = await bcrypt.hash(nuevaContrasena, SALT_ROUNDS); // Encriptar la nueva contraseña
    const updatedUser = await prisma.usuario.update({
      where: { correo },
      data: { contrasena: hashedPassword, resetToken: null },
    });
    console.log('Password has been reset successfully:', updatedUser);
    return updatedUser;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
