import express from 'express';
import upload from '../middleware/upload.js';
import { addDriver, addConductor } from '../controllers/crewController.js';
const router = express.Router();

router.post('/driver', upload.fields([{ name: 'licenseImage' }, { name: 'busImage' }]), addDriver);
router.post('/conductor', upload.single('nationalIdImage'), addConductor);

export default router;
