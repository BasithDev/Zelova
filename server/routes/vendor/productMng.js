const express = require('express');
const router = express.Router();
const {verifyToken} = require('../../middlewares/authValidator')
const {addProduct, getProducts, listOrUnlist, deleteProduct, updateProduct, updateOffer} = require('../../controllers/vendor/productMng')
router.use(verifyToken('vendor'))
router.post('/product',addProduct)
router.get('/products',getProducts)
router.patch('/product/:id/list-or-unlist',listOrUnlist)
router.delete('/product/:id/delete',deleteProduct)
router.put('/product/update',updateProduct)
router.patch('/product/offer/update',updateOffer)
module.exports = router;