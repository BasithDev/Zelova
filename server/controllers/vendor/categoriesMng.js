const Category = require('../../models/category')
const SubCategory = require('../../models/subCategory')
const statusCodes = require('../../config/statusCodes')

const addCategory = async (req, res) => {
  console.log('hello')
  try {
    const { name } = req.body;
    if (await Category.findOne({ name })) {
      return res.status(statusCodes.BAD_REQUEST).json({ message: "Category already exists." });
    }
    const category = await new Category({ name }).save();
    res.status(statusCodes.CREATED).json({ message: "Category added successfully." });
  } catch (error) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error.", error });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    if (categories.length === 0) {
      return res.status(statusCodes.NOT_FOUND).json({ message: "No categories found." });
    }
    res.status(statusCodes.OK).json({ message: "Categories retrieved successfully.", categories });
  } catch (error) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error.", error });
  }
};

const getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find().sort({ name: 1 });
    if (subCategories.length === 0) {
      return res.status(statusCodes.NOT_FOUND).json({ message: "No categories found." });
    }
    res.status(statusCodes.OK).json({ message: "Categories retrieved successfully.", subCategories });
  } catch (error) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error.", error });
  }
};

const addSubCategory = async (req, res) => {
  try {
    const { name, categoryName } = req.body;
    if (!(await Category.findOne({ name: categoryName }))) {
      return res.status(statusCodes.NOT_FOUND).json({ message: "Category not found." });
    }
    if (await SubCategory.findOne({ name })) {
      return res.status(statusCodes.BAD_REQUEST).json({ message: "Subcategory already exists." });
    }
    const subCategory = await new SubCategory({ name, categoryName }).save();
    res.status(statusCodes.CREATED).json({ message: "Subcategory added successfully." });
  } catch (error) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error.", error });
  }
}

module.exports = {
  addCategory,
  getCategories,
  addSubCategory,
  getSubCategories
}