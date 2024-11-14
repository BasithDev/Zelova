const express = require('express');
const router = express.Router();
const {getRestaurant} = require('../../controllers/vendor/restaurantController')
router.get('/restaurant',getRestaurant)
module.exports = router