
const express = require('express');
const router = express.Router();
const auth = require('./auth');

router.get('/', (req, res) => {
    return res.send('ok');
});

router.use('/auth', auth);


module.exports = router;