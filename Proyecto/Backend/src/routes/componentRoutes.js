import { Router } from 'express';
import { getTopComponents } from '../controllers/componentController.js';

const router = Router();

router.get('/top-components', getTopComponents);

export default router;