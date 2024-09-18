const Category = require('../models/Category');
const Announcement = require('../models/Announcement'); // Import the Announcement model

// Get categories and announcements
exports.getCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;

    const totalCategories = await Category.countDocuments({ parent: null });
    const totalPages = Math.ceil(totalCategories / limit);

    const parentCategories = await Category.find({ parent: null })
      .skip(skip)
      .limit(limit)
      .lean();

    const allCategories = await Category.find().lean();

    // Fetch announcements
    const announcements = await Announcement.find();

    // Build parent-child relationships and calculate child counts
    const categoriesMap = {};
    allCategories.forEach(category => {
      categoriesMap[category._id.toString()] = { ...category, children: [] };
    });

    allCategories.forEach(category => {
      if (category.parent) {
        const parentId = category.parent.toString();
        if (categoriesMap[parentId]) {
          categoriesMap[parentId].children.push(category);
        }
      }
    });

    const categories = parentCategories.map(parent => {
      const fullParent = categoriesMap[parent._id.toString()];
      fullParent.childCount = fullParent.children.length;
      return fullParent;
    });

    res.render('categories', {
      categories,
      allCategories,
      user: req.user,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      announcements // Pass announcements to the EJS template
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).send('Error fetching categories');
  }
};

exports.addOrUpdateCategory = async (req, res) => {
  try {
    const { id, name, parent, description } = req.body;

    if (id) {
      // Update existing category
      await Category.findByIdAndUpdate(id, { name, parent: parent || null, description });
    } else {
      // Add new category
      const newCategory = new Category({ name, parent: parent || null, description });
      await newCategory.save();
    }

    res.redirect('/it/category-management');
  } catch (error) {
    res.status(500).send('Error saving category');
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { reassignTo } = req.body;

    // Find the category to be deleted
    const categoryToDelete = await Category.findById(categoryId);

    if (!categoryToDelete) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Check if the category has children
    const childCategories = await Category.find({ parent: categoryId });

    if (childCategories.length > 0) {
      if (reassignTo) {
        // Reassign children to the new parent category
        await Category.updateMany({ parent: categoryId }, { parent: reassignTo });
      } else {
        // Make child categories parent categories
        await Category.updateMany({ parent: categoryId }, { $unset: { parent: 1 } });
      }
    }

    // Delete the specified category
    await Category.findByIdAndDelete(categoryId);
    console.log('Deleted category:', categoryId);

    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ success: false, message: 'Error deleting category', details: error.message });
  }
};