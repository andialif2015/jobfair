const express = require('express');
const router = express.Router();
const umkmController = require('../controllers/umkm');
const serializeToken = require('../middleware/serialize-token');
const multer  = require('multer');
const upload = multer();

router.post('/lowongan/add',upload.none(), serializeToken, umkmController.addLowongan);
router.get('/all', serializeToken,upload.none(), umkmController.getAllLowongan);
router.get('/saved', serializeToken,upload.none(), umkmController.getLowonganSaveById);
router.get('/lowongan/detail/:id',upload.none(), serializeToken, umkmController.detailLowongan);

module.exports = router;