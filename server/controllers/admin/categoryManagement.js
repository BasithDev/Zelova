const Category = require('../../models/category')
const SubCategory = require('../../models/subCategory')
const statusCodes = require('../../config/statusCodes')

const getCategories = async (req, res, next) => {
    try {
      const categories = await Category.find();
      res.status(statusCodes.OK).json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
};

const deleteCategory = async (req, res, next) => {
    const { id } = req.params;
    try {
      const category = await Category.findByIdAndDelete(id);
      if (!category) {
        return res.status(statusCodes.NOT_FOUND).json({ success: false, message: 'Category not found' });
      }
      res.status(statusCodes.OK).json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
      next(error);
    }
};

const getSubCategories = async (req, res, next) => {
    try {
      const subCategories = await SubCategory.find()
      res.status(statusCodes.OK).json({ success: true, data: subCategories });
    } catch (error) {
      next(error);
    }
};

const deleteSubCategory = async (req, res, next) => {
    const { id } = req.params;
    try {
      const subCategory = await SubCategory.findByIdAndDelete(id);
      if (!subCategory) {
        return res.status(statusCodes.NOT_FOUND).json({ success: false, message: 'Subcategory not found' });
      }
      res.status(statusCodes.OK).json({ success: true, message: 'Subcategory deleted successfully' });
    } catch (error) {
      next(error);
    }
};

module.exports = {
  getCategories,
  deleteCategory,
  getSubCategories,
  deleteSubCategory
};