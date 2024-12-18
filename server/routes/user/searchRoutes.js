const express = require('express');
const router = express.Router();

const { getProducts } = require('../../controllers/user/searchController');

router.get('/', getProducts);

module.exports = router;