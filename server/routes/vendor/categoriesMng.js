const express = require('express');
const router = express.Router();

const {
    addCategory,
    addSubCategory,
    getCategories,
    getSubCategories
} = require('../../controllers/vendor/categoriesMng')

router.post('/category', addCategory);
router.post('/subcategory', addSubCategory);
router.get('/categories', getCategories);
router.get('/subcategories', getSubCategories);

module.exports = router;