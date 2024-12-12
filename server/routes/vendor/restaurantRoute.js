const express = require('express');
const router = express.Router();

const {
    getRestaurant,
    openOrCloseShop,
    updateRestaurantDetails,
    updateRestaurantPic,
    setLocation
} = require('../../controllers/vendor/restaurantMng')

router.get('/', getRestaurant);
router.patch('/shop-status', openOrCloseShop);
router.put('/update', updateRestaurantDetails);
router.post('/update-pic', updateRestaurantPic);
router.post('/set-location', setLocation);

module.exports = router;