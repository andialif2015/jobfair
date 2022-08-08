const express = require('express');
const router = express.Router();
const umkmController = require('../controllers/umkm');
const serializeToken = require('../middleware/serialize-token');

router.post('/lowongan/add', serializeToken, umkmController.addLowongan);
router.get('/all', serializeToken, umkmController.getAllLowongan);
router.get('/saved', serializeToken, umkmController.getLowonganSaveById);
router.get('/lowongan/detail/:id', serializeToken, umkmController.detailLowongan);

module.exports = router;