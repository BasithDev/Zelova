const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Seller Auth Routes');
});

module.exports = router;
