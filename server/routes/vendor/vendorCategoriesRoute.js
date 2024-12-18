const express = require('express');
const router = express.Router();

const {
    addCategory,
    addSubCategory,
    getCategories,
    getSubCategories
} = require('../../controllers/vendor/vendorCategoriesController')

router.get('/categories',getCategories)
router.get('/subcategories',getSubCategories)
router.post('/category/add',addCategory)
router.post('/subcategory/add',addSubCategory)

module.exports = router;