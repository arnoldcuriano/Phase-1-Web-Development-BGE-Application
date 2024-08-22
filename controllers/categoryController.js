const Category = require('../models/Category');

// Fetch paginated categories with their parent categories
exports.fetchCategories = async (req) => {
  const limit = 10; // Number of categories per page
  const page = parseInt(req.query.page) || 1; // Current page number

  const totalCategories = await Category.countDocuments();
  const totalPages = Math.ceil(totalCategories / limit);

  const categories = await Category.find()
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('parent');

  return { categories, totalPages, currentPage: page };
};

// Add a new category
exports.addCategory = async (req, res) => {
  const { name, parent, description } = req.body;
  const newCategory = new Category({ name, parent, description });

  await newCategory.save();
  res.status(200).json({ success: true });
};

// Update an existing category
exports.updateCategory = async (req, res) => {
  const { id, name, parent, description, active } = req.body;

  await Category.findByIdAndUpdate(id, { name, parent, description, active });
  res.status(200).json({ success: true });
};

// Check if a category has child categories and provide reassignment options
exports.checkChildCategories = async (req, res) => {
  const categoryId = req.params.id;
  const childCategories = await Category.find({ parent: categoryId });

  if (childCategories.length > 0) {
    res.status(200).json({ success: true, childCategories });
  } else {
    res.status(200).json({ success: true, message: 'No child categories found' });
  }
};

// Delete a category by ID with child category reassignment or deletion
exports.deleteCategory = async (req, res) => {
  const categoryId = req.params.id;
  const { reassignTo } = req.body;

  // Find all child categories of the category to be deleted
  const childCategories = await Category.find({ parent: categoryId });

  if (childCategories.length > 0 && !reassignTo) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete category with child categories without reassignment or deletion.',
    });
  }

  if (reassignTo) {
    // Reassign child categories to a new parent
    const reassignmentExists = await Category.exists({ _id: reassignTo });
    if (!reassignmentExists) {
      return res.status(400).json({ success: false, message: 'Invalid reassignment category' });
    }
    await Category.updateMany({ parent: categoryId }, { parent: reassignTo });
  } else {
    // Delete all child categories
    await Category.deleteMany({ parent: categoryId });
  }

  // Delete the parent category
  const result = await Category.findByIdAndDelete(categoryId);

  if (result) {
    res.json({ success: true, message: 'Category deleted successfully' });
  } else {
    res.status(404).json({ success: false, message: 'Category not found' });
  }
};
