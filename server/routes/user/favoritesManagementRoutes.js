const express = require('express');
const router = express.Router();
const {addFavorite,removeFavorite,getFavorites} = require('../../controllers/user/favoritesManagementController')

router.post('/add',addFavorite)
router.delete('/remove',removeFavorite)
router.get('/',getFavorites)

module.exports = router;