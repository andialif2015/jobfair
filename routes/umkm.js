const express = require('express');
const router = express.Router();
const umkmController = require('../controllers/umkm');
const serializeToken = require('../middleware/serialize-token');
const multer  = require('multer');
const upload = multer();

router.post('/lowongan/add',upload.none(), serializeToken, umkmController.addLowongan);
router.get('/all', serializeToken,upload.none(), umkmController.getAllLowongan);
router.get('/saved', serializeToken,upload.none(), umkmController.getLowonganSaveById);
router.get('/list-pelamar', serializeToken,upload.none(), umkmController.getPelamar);
router.get('/lowongan/detail/:id',upload.none(), serializeToken, umkmController.detailLowongan);
router.get('/riwayat/lowongan',upload.none(), serializeToken, umkmController.riwayatLowongan);
router.put('/terima-lamaran',upload.none(), serializeToken, umkmController.terimaLamaran);
router.put('/tolak-lamaran',upload.none(), serializeToken, umkmController.tolakLamaran);

module.exports = router;