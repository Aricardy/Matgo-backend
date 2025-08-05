// ...existing imports and code...
// Only one router declaration and one export default should exist in this file.
import { getFeaturedMatatus } from '../controllers/matatuController.js';
router.get('/featured', getFeaturedMatatus);
const express = require('express');
const router = express.Router();
const controller = require('../controllers/matatuController');

router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
