import { Router } from 'express';
import { createUserHandler, authenticateUserHandler } from '../controllers/userController.js';
import { requestPasswordResetHandler, resetPasswordHandler } from '../controllers/passwordController.js';
import {getMotherBoards, getCPUsCompatibles} from '../controllers/ensambleController.js';

const router = Router();

router.post('/users', createUserHandler);
router.post('/login', authenticateUserHandler);
router.post('/request-password-reset', requestPasswordResetHandler); // Nueva ruta para solicitud de restablecimiento
router.post('/reset-password', resetPasswordHandler); // Nueva ruta para restablecer contraseña
router.get("/boards", getMotherBoards);
router.post("/cpus-compatibles", getCPUsCompatibles);


export default router;
