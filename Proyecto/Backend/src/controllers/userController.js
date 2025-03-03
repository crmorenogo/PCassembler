
import { createUser, authenticateUser } from '../services/userService.js';

// Función para manejar la creación de usuarios
export async function createUserHandler(req, res) {
  const { nombre, correo, contrasena } = req.body;
  console.log(nombre, correo, contrasena)
  let rol = 'usuario';
  // Verificar que todos los campos requeridos están presentes
  if (!nombre || !correo || !contrasena || !rol) {
    return res.status(400).json({ error: 'Campos requeridos faltantes' });
  }

  try {
    const newUser = await createUser(nombre, correo, contrasena, rol);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
}

// Función para manejar la autenticación de usuarios
export async function authenticateUserHandler(req, res) {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ error: 'Campos requeridos faltantes' });
  }

  try {
    const authResult = await authenticateUser(correo, contrasena);
    
    if (authResult) {
      // Devolver usuario y token en la respuesta
      res.status(200).json({
        message: 'Authentication successful',
        correo: authResult.correo,
        nombre: authResult.nombre,
        rol: authResult.rol,
        token: authResult.token

      });
    } else {
      res.status(401).json({ error: 'Authentication failed' });
    }
  } catch (error) {
    console.error('Error authenticating user:', error.message);
    res.status(500).json({ error: 'Error authenticating user' });
  }
}
