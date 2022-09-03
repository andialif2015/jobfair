const express = require('express');
const router = express.Router();
const pelamarController = require('../controllers/pelamar');
const serializeToken = require('../middleware/serialize-token');
const multer  = require('multer');
const upload = multer();


router.post('/daftar-lowongan', serializeToken,upload.none(), pelamarController.daftarLowongan);
router.get('/list-lowongan', serializeToken,upload.none(), pelamarController.listLowongan);
router.get('/detail', serializeToken,upload.none(), pelamarController.detailPelamar);

module.exports = router;