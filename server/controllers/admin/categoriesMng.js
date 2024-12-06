const Category = require('../../models/category')
const SubCategory = require('../../models/subCategory')

const getCategories = async (req, res) => {
    try {
      const categories = await Category.find();
      res.status(200).json({ success: true, data: categories });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch categories', error: error.message });
    }
};

const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
      const category = await Category.findByIdAndDelete(id);
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      res.status(200).json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete category', error: error.message });
    }
};

const getSubCategories = async (req, res) => {
    try {
      const subCategories = await SubCategory.find()
      res.status(200).json({ success: true, data: subCategories });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch subcategories', error: error.message });
    }
};

const deleteSubCategory = async (req, res) => {
    const { id } = req.params;
    try {
      const subCategory = await SubCategory.findByIdAndDelete(id);
      if (!subCategory) {
        return res.status(404).json({ success: false, message: 'Subcategory not found' });
      }
      res.status(200).json({ success: true, message: 'Subcategory deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete subcategory', error: error.message });
    }
};

module.exports = {
  getCategories,
  deleteCategory,
  getSubCategories,
  deleteSubCategory
};