const express = require('express');
const { getRestaurants } = require('../../controllers/user/restaurantListing');
const router = express.Router();

router.get('/nearby-restaurants',getRestaurants)

module.exports = router