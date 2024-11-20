const Category = require('../../models/category')
const SubCategory = require('../../models/subCategory')

exports.addCategory = async (req, res) => {
  console.log('hello')
  try {
    const { name } = req.body;
    if (await Category.findOne({ name })) {
      return res.status(400).json({ message: "Category already exists." });
    }
    const category = await new Category({ name }).save();
    res.status(201).json({ message: "Category added successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal server error.", error });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    if (categories.length === 0) {
      return res.status(404).json({ message: "No categories found." });
    }
    res.status(200).json({ message: "Categories retrieved successfully.", categories });
  } catch (error) {
    res.status(500).json({ message: "Internal server error.", error });
  }
};

exports.getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find().sort({ name: 1 });
    if (subCategories.length === 0) {
      return res.status(404).json({ message: "No categories found." });
    }
    res.status(200).json({ message: "Categories retrieved successfully.", subCategories });
  } catch (error) {
    res.status(500).json({ message: "Internal server error.", error });
  }
};

exports.addSubCategory = async (req, res) => {
  try {
    const { name, categoryName } = req.body;
    if (!(await Category.findOne({ name: categoryName }))) {
      return res.status(404).json({ message: "Category not found." });
    }
    if (await SubCategory.findOne({ name })) {
      return res.status(400).json({ message: "Subcategory already exists." });
    }
    const subCategory = await new SubCategory({ name, categoryName }).save();
    res.status(201).json({ message: "Subcategory added successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal server error.", error });
  }
};