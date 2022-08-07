const express = require('express');
const router = express.Router();
const umkmController = require('../controllers/umkm');
const serializeToken = require('../middleware/serialize-token');

router.post('/lowongan/add', serializeToken, umkmController.addLowongan);

module.exports = router;