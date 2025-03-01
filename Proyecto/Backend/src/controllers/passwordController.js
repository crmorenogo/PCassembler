/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { generatePasswordResetToken, sendPasswordResetEmail, resetPassword } from '../services/userService.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno desde el archivo .env

const JWT_SECRET = process.env.JWT_SECRET; // Usar JWT_SECRET desde el archivo .env

// Función para manejar solicitud de restablecimiento de contraseña
export async function requestPasswordResetHandler(req, res) {
  const { correo } = req.body;
  try {
    const token = await generatePasswordResetToken(correo);
    await sendPasswordResetEmail(correo, token);
    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ error: 'Error requesting password reset' });
  }
}

// Función para manejar el restablecimiento de contraseña
export async function resetPasswordHandler(req, res) {
  const { token, nuevaContrasena } = req.body;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const correo = decoded.correo;
    await resetPassword(correo, nuevaContrasena);
    res.status(200).json({ message: 'Password has been reset' });
  } catch (error) {
    res.status(500).json({ error: 'Error resetting password' });
  }
}