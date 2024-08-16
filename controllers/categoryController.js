const Category = require('../models/Category');

exports.getCategories = async (req, res, returnData = false) => {
  try {
    // Pagination setup
    const limit = 10; // Number of categories per page
    const page = parseInt(req.query.page) || 1; // Current page number

    // Total number of categories
    const totalCategories = await Category.countDocuments();
    const totalPages = Math.ceil(totalCategories / limit);

    // Fetch categories for the current page
    const categories = await Category.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('parent');

    if (returnData) {
      return { categories, totalPages, currentPage: page }; // Return categories with pagination info
    } else {
      res.render('categories', { categories, user: req.user, totalPages, currentPage: page });
    }
  } catch (error) {
    if (!returnData) {
      res.status(500).send('Error fetching categories');
    }
    throw error;
  }
};

exports.addCategory = async (req, res) => {
  try {
    const { name, parent, description } = req.body;
    const newCategory = new Category({ name, parent, description });
    await newCategory.save();
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding category' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id, name, parent, description, active } = req.body;
    await Category.findByIdAndUpdate(id, { name, parent, description, active });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating category' });
  }
};

exports.checkChildCategories = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Find all child categories of the category to be checked
    const childCategories = await Category.find({ parent: categoryId });

    if (childCategories.length > 0) {
      // If there are child categories, respond with the list of child categories
      res.status(200).json({ success: true, childCategories });
    } else {
      // No child categories found
      res.status(200).json({ success: true, message: 'No child categories found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error checking child categories', details: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { reassignTo } = req.body;

    // Find all child categories of the category to be deleted
    const childCategories = await Category.find({ parent: categoryId });

    if (childCategories.length > 0 && !reassignTo) {
      // If there are child categories and no reassignment, respond with an error
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with child categories without reassignment or deletion.'
      });
    }

    if (reassignTo) {
      // Reassign child categories to a new parent
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
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', details: error.message });
  }
};
