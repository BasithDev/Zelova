const express = require('express');
const router = express.Router();

const { getProducts } = require('../../controllers/user/search');

router.get('/', getProducts);

module.exports = router;