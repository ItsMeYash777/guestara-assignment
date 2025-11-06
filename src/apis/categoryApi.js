const prisma = require('../config/database');

// Create a category
const createCategory = async (req, res) => {
  try {
    const { name, image, description, taxApplicability, tax, taxType } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const category = await prisma.category.create({
      data: {
        name,
        image,
        description,
        taxApplicability: taxApplicability || false,
        tax: taxApplicability ? tax : null,
        taxType: taxApplicability ? taxType : null,
      },
    });

    res.status(201).json({
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    console.error('Error creating category:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Category with this name already exists' });
    }
    res.status(500).json({ error: 'Failed to create category', message: error.message });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
        include: {
            subCategories: true,
            items: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    res.status(200).json({
      message: 'Categories retrieved successfully',
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories', message: error.message });
  }
};

// Get category by ID or name
const getCategoryByIdOrName = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.findFirst({
      where: { 
        OR: [
          { id: id },
          { name: id },
        ],
      },
      include: {
        subCategories: {
          include: {
            items: true,
          },
        },
        items: true,
      },
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json({
      message: 'Category retrieved successfully',
      data: category,
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category', message: error.message });
  }
};

// Update category
const updateCategory = async (req,res) =>{
  try {
    const {id} = req.params;
    const {name, image, description, taxApplicability, tax, taxType} = req.body;
    const updateData = {}
    if (name !== undefined) updateData.name = name;
    if (image !== undefined) updateData.image = image;
    if (description !== undefined) updateData.description = description;
    if (taxApplicability !== undefined) updateData.taxApplicability = taxApplicability;
    if (tax !== undefined) updateData.tax = tax;
    if (taxType !== undefined) updateData.taxType = taxType;
    const category = await prisma.category.update({
      where: {id},
      data: updateData,
    });
    res.status(200).json({
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(400).json({ error: 'Category not found' });
    }
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category', message: error.message });
  }
}

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryByIdOrName,
  updateCategory,
};

