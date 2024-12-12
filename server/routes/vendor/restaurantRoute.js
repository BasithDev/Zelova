const express = require('express');
const router = express.Router();

const {verifyToken} = require('../../middlewares/authValidator')
router.use(verifyToken('vendor'))

const {
    getRestaurant,
    openOrCloseShop,
    setLocation,
    updateRestaurantDetails,
    updateRestaurantPic
} = require('../../controllers/vendor/restaurantController');

router.get('/restaurant', getRestaurant);
router.put('/restaurant/details', updateRestaurantDetails);
router.patch('/restaurant/status', openOrCloseShop);
router.patch('/restaurant/image', updateRestaurantPic);
router.patch('/restaurant/location', setLocation);

module.exports = router;