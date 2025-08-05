const express = require('express');
const router = express.Router();
const { ping, sampleData } = require('../controllers/pingController');

router.get('/ping', ping);
router.get('/data', sampleData);

module.exports = router;
