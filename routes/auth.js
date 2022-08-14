const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const serializeToken = require('../middleware/serialize-token');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/data-diri/pelamar', serializeToken , authController.dataDiriPelamar);
router.post('/data-diri/umkm', serializeToken , authController.dataDiriUmkm);

module.exports = router;