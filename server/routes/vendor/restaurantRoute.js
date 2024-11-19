const express = require('express');
const router = express.Router();

const {
    getRestaurant,
    openOrCloseShop,
    setLocation,
    updateRestaurantDetails,
    updateRestaurantPic
} = require('../../controllers/vendor/restaurantController');

const {
    addCategory,
    addSubCategory,
    getCategories
} = require('../../controllers/vendor/categoriesMng')

const {addOffer,getOffers, deleteOffer} = require('../../controllers/vendor/offersMng')

router.get('/restaurant/:userId', getRestaurant);
router.put('/restaurant/:userId/details', updateRestaurantDetails);
router.patch('/restaurant/:userId/status', openOrCloseShop);
router.patch('/restaurant/:userId/image', updateRestaurantPic);
router.patch('/restaurant/:userId/location', setLocation);

router.get('/categories',getCategories)
router.post('/category/add',addCategory)
router.post('/subcategory/add',addSubCategory)

router.delete('/offer/:offerId',deleteOffer)
router.get('/offers/:restaurantId', getOffers);
router.post('/offer/add',addOffer)

module.exports = router;