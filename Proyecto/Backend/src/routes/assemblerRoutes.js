import { Router } from 'express';
import {getMotherBoards, getCPUsCompatibles, getGPUsCompatibles, getMemoryCompatibles,getDisksCompatibles, getCompatiblePSUs,getCompatibleCases,getCompatibleMonitors} from '../controllers/assemblerController.js';

const router = Router();

router.get("/boards", getMotherBoards);
router.post("/cpus-compatibles", getCPUsCompatibles);
router.post("/gpus-compatibles", getGPUsCompatibles);
router.post("/get-memory-compatibles", getMemoryCompatibles);
router.post("/get-compatible-disks", getDisksCompatibles);
router.post("/get-compatible-psus", getCompatiblePSUs);
router.post("/get-compatible-cases", getCompatibleCases);
router.post("/get-compatible-monitors", getCompatibleMonitors);

export default router;
