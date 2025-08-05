import express from 'express';
import { getAll, getOne, create, update, remove } from '../controllers/passengerController.js';
import upload from '../middleware/upload.js';
const router = express.Router();

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', upload.single('avatar'), create);
router.put('/:id', upload.single('avatar'), update);
router.delete('/:id', remove);

export default router;
