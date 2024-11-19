const express = require('express');
const router = express.Router();

const {
    getRestaurant,
    openOrCloseShop,
    setLocation,
    updateRestaurantDetails,
    updateRestaurantPic
} = require('../../controllers/vendor/restaurantController');

router.get('/restaurant/:userId', getRestaurant);
router.put('/restaurant/:userId/details', updateRestaurantDetails);
router.patch('/restaurant/:userId/status', openOrCloseShop);
router.patch('/restaurant/:userId/image', updateRestaurantPic);
router.patch('/restaurant/:userId/location', setLocation);

module.exports = router;