const express = require('express');
const router = express.Router();
const { getCoupons, addCoupon, updateCoupon, deleteCoupon } = require('../../controllers/admin/couponMngController')
const {verifyToken} = require('../../middlewares/authValidator')
router.use(verifyToken('admin'))
router.get('/', getCoupons);
router.post('/add', addCoupon);
router.put('/update/:id', updateCoupon);
router.delete('/delete/:id', deleteCoupon);

module.exports = router