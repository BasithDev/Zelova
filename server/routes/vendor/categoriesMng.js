const express = require('express');
const router = express.Router();

const {verifyToken} = require('../../middlewares/authValidator')
router.use(verifyToken('vendor'))

const {
    addCategory,
    addSubCategory,
    getCategories,
    getSubCategories
} = require('../../controllers/vendor/categoriesMng')

router.get('/categories',getCategories)
router.get('/subcategories',getSubCategories)
router.post('/category/add',addCategory)
router.post('/subcategory/add',addSubCategory)

module.exports = router;