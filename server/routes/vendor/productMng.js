const express = require('express');
const router = express.Router();

const {
    addProduct,
    getProducts,
    listOrUnlist,
    deleteProduct,
    updateProduct,
    updateOffer
} = require('../../controllers/vendor/productMng')

router.post('/product', addProduct);
router.get('/products', getProducts);
router.patch('/product/:id/list-or-unlist', listOrUnlist);
router.delete('/product/:id', deleteProduct);
router.put('/product/:id', updateProduct);
router.patch('/product/:id/offer', updateOffer);

module.exports = router;