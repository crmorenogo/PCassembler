import { Router } from 'express';
import { registrarEnsamble, obtenerEnsamblesUsuario } from "../controllers/assemblerController.js"; // Asegúrate de incluir .js

const router = Router();
    
router.post("/registrar-ensamble", registrarEnsamble);
router.get("/obtener-ensambles-usuario", obtenerEnsamblesUsuario);
//Ver historial de compra
export default router;
