const prisma = require('../config/database');

// Create a SubCategory
const createSubCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, image, description, taxApplicability, tax } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const subCategory = await prisma.subCategory.create({
      data: {
        name,
        image,
        description,
        taxApplicability: taxApplicability !== undefined ? taxApplicability : category.taxApplicability,
        tax: tax !== undefined ? tax : category.tax,
        categoryId,
      },
      include: {
        category: true,
      },
    });

    res.status(201).json({
      message: 'SubCategory created successfully',
      data: subCategory,
    });
  } catch (error) {
    console.error('Error creating SubCategory:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'SubCategory with this name already exists' });
    }
    res.status(500).json({ error: 'Failed to create SubCategory', message: error.message });
  }
};

// Get all sub-categories
const getAllSubCategories = async (req, res) => {
  try {
    const subCategories = await prisma.subCategory.findMany({
      include: {
        category: true,
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      message: 'SubCategories retrieved successfully',
      data: subCategories,
    });
  } catch (error) {
    console.error('Error fetching SubCategories:', error);
    res.status(500).json({ error: 'Failed to fetch SubCategories', message: error.message });
  }
};

// Get all SubCategories under a Category
const getSubCategoriesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const subCategories = await prisma.subCategory.findMany({
      where: {
        categoryId, 
      },
      include: {
        category: true,
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      message: 'SubCategories retrieved successfully',
      data: subCategories,
    });
  } catch (error) {
    console.error('Error fetching SubCategories:', error);
    res.status(500).json({ error: 'Failed to fetch SubCategories', message: error.message });
  }
};

// Get SubCategory by ID or name
const getSubCategoryByIdOrName = async (req, res) => {
  try {
    const { id } = req.params;

    const subCategory = await prisma.subCategory.findFirst({
      where: {
        OR: [
          { id: id },
          { name: id },
        ],
      },
      include: {
        category: true,
        items: true,
      },
    });

    if (!subCategory) {
      return res.status(404).json({ error: 'SubCategory not found' });
    }

    res.status(200).json({
      message: 'SubCategory retrieved successfully',
      data: subCategory,
    });
  } catch (error) {
    console.error('Error fetching SubCategory:', error);
    res.status(500).json({ error: 'Failed to fetch SubCategory', message: error.message });
  }
};

// Update SubCategory
const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image, description, taxApplicability, tax } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (image !== undefined) updateData.image = image;
    if (description !== undefined) updateData.description = description;
    if (taxApplicability !== undefined) updateData.taxApplicability = taxApplicability;
    if (tax !== undefined) updateData.tax = tax;

    const subCategory = await prisma.subCategory.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });

    res.status(200).json({
      message: 'SubCategory updated successfully',
      data: subCategory,
    });
  } catch (error) {
    console.error('Error updating SubCategory:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'SubCategory with this name already exists' });
    }
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'SubCategory not found' });
    }
    res.status(500).json({ error: 'Failed to update SubCategory', message: error.message });
  }
};

module.exports = {
  createSubCategory,
  getAllSubCategories,
  getSubCategoriesByCategory,
  getSubCategoryByIdOrName,
  updateSubCategory,
};

