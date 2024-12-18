const express = require('express');
const router = express.Router()

const {getAvailableCoupons} = require('../../controllers/user/redeemedCouponsManagement')

router.get('/',getAvailableCoupons)

module.exports = router;