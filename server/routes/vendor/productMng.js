const express = require('express');
const router = express.Router();
const {addProduct, getProducts} = require('../../controllers/vendor/productMng')
router.post('/product',addProduct)
router.get('/products',getProducts)
module.exports = router;