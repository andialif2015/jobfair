const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const serializeToken = require('../middleware/serialize-token');

router.post('/pengalaman', serializeToken, userController.pengalaman);
router.post('/save-lowongan', serializeToken, userController.simpanLowongan);
router.get('/profil/umkm', serializeToken, userController.getProfileUmkm);
router.get('/profil/pelamar', serializeToken, userController.getProfilePelamar);
router.put('/profil/umkm/edit', serializeToken, userController.updateProfilUmkm);
router.put('/profil/pelamar/edit', serializeToken, userController.updateProfilPelamar);
router.put('/profil/reset-password', serializeToken, userController.resetPassword);

module.exports = router;