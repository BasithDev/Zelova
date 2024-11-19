const express = require('express');
const router = express.Router();
const {addProduct} = require('../../controllers/vendor/productMng')
router.post('/product',addProduct)

module.exports = router;