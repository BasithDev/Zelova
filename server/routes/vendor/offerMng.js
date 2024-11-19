const express = require('express');
const router = express.Router();

const {
    addOffer,
    getOffers,
    deleteOffer
} = require('../../controllers/vendor/offersMng')

router.delete('/delete/:offerId',deleteOffer)
router.get('/', getOffers);
router.post('/add',addOffer)

module.exports = router;