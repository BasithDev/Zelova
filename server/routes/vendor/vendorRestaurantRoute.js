const express = require('express');
const router = express.Router();

const {
    getRestaurant,
    openOrCloseShop,
    setLocation,
    updateRestaurantDetails,
    updateRestaurantPic
} = require('../../controllers/vendor/vendorRestaurantController');

router.get('/restaurant', getRestaurant);
router.put('/restaurant/details', updateRestaurantDetails);
router.patch('/restaurant/status', openOrCloseShop);
router.patch('/restaurant/image', updateRestaurantPic);
router.patch('/restaurant/location', setLocation);

module.exports = router;