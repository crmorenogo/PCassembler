import { Router } from 'express';
import { registrarEnsamble } from "../controllers/assemblerController.js"; // Asegúrate de incluir .js

const router = Router();
    
router.post("/registrar-ensamble", registrarEnsamble);
//Ver historial de compra
export default router;
