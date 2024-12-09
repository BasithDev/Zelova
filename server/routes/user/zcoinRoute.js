const express = require('express');
const router = express.Router();
const { getZcoinsData , sendZcoins, searchUsers } = require('../../controllers/user/zcoins');

router.get('/', getZcoinsData);
router.post('/send', sendZcoins);
router.get('/search', searchUsers);

module.exports = router;