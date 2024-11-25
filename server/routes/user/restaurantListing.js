const express = require('express');
const { getRestaurants, getMenu } = require('../../controllers/user/restaurantListing');
const router = express.Router();

router.get('/nearby-restaurants',getRestaurants)
router.get('/:id/menu', getMenu);

module.exports = router