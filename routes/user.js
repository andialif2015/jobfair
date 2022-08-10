const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const serializeToken = require('../middleware/serialize-token');
const mediaController = require('../controllers/mediaController');
const storage = require('../middleware/storage');
const multer  = require('multer');
const upload = multer();

router.post('/pengalaman',upload.none(), serializeToken, userController.pengalaman);
router.post('/save-lowongan',upload.none(), serializeToken, userController.simpanLowongan);
router.post('/profil/upload', serializeToken, storage.single('img_profil') , mediaController.single);
router.get('/profil/umkm',upload.none(), serializeToken, userController.getProfileUmkm);
router.get('/profil/pelamar',upload.none(), serializeToken, userController.getProfilePelamar);
router.put('/profil/umkm/edit',upload.none(), serializeToken, userController.updateProfilUmkm);
router.put('/profil/pelamar/edit',upload.none(), serializeToken, userController.updateProfilPelamar);
router.put('/profil/reset-password',upload.none(), serializeToken, userController.resetPassword);
router.put('/profil/reset-password',upload.none(), serializeToken, userController.resetPassword);

module.exports = router;