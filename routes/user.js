const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const serializeToken = require('../middleware/serialize-token');

router.post('/pengalaman', serializeToken, userController.pengalaman);


module.exports = router;