const express = require('express');
const router = express.Router();
const { getCoupons, addCoupon, updateCoupon, deleteCoupon } = require('../../controllers/admin/couponManagementController')

router.get('/', getCoupons);
router.post('/add', addCoupon);
router.put('/update/:id', updateCoupon);
router.delete('/delete/:id', deleteCoupon);

module.exports = router