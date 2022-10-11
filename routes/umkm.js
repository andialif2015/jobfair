const express = require('express');
const router = express.Router();
const umkmController = require('../controllers/umkm');
const serializeToken = require('../middleware/serialize-token');
const multer  = require('multer');
const upload = multer();

router.post('/lowongan/add',upload.none(), serializeToken, umkmController.addLowongan);
router.get('/all', upload.none(), umkmController.getAllLowongan);
router.get('/saved', serializeToken,upload.none(), umkmController.getLowonganSaveById);
router.get('/list-pelamar', serializeToken,upload.none(), umkmController.getPelamar);
router.get('/lowongan/detail/:id', serializeToken,upload.none(), umkmController.detailLowongan);
router.get('/lowongan/:id',upload.none(), umkmController.detailLowonganId);
router.get('/riwayat/lowongan',upload.none(), serializeToken, umkmController.riwayatLowongan);
router.get('/rekomendasi',upload.none(), serializeToken, umkmController.rekomendasi);
router.put('/terima-lamaran',upload.none(), serializeToken, umkmController.terimaLamaran);
router.put('/tolak-lamaran',upload.none(), serializeToken, umkmController.tolakLamaran);
router.put('/count',upload.none(), serializeToken, umkmController.postKlik);

module.exports = router;