
const express = require('express');
const router = express.Router();
const multer  = require('multer');
const upload = multer();
const auth = require('./auth');
const user = require('./user');
const umkm = require('./umkm');

router.get('/', (req, res) => {
    return res.send('ok');
});

router.use('/auth', upload.none(), auth);
router.use('/user', user);
router.use('/umkm', umkm);


module.exports = router;