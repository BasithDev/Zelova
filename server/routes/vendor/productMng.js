const express = require('express');
const router = express.Router();
const {addProduct, getProducts, listOrUnlist, deleteProduct, updateProduct} = require('../../controllers/vendor/productMng')
router.post('/product',addProduct)
router.get('/products',getProducts)
router.patch('/product/:id/list-or-unlist',listOrUnlist)
router.delete('/product/:id/delete',deleteProduct)
router.put('/product/update',updateProduct)
module.exports = router;