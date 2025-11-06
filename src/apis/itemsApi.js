const prisma = require('../config/database');

// Create an Item
const createItem = async (req, res) => {
  try {
    const { 
      name, 
      image, 
      description, 
      taxApplicability, 
      tax, 
      baseAmount, 
      discount,
      categoryId,
      subCategoryId 
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (baseAmount === undefined || baseAmount === null) {
      return res.status(400).json({ error: 'Base amount is required' });
    }

    const discountAmount = discount || 0;
    const totalAmount = baseAmount - discountAmount; 

    if (!categoryId && !subCategoryId) {
      return res.status(400).json({ error: 'Item must be linked to either a category or sub-category' });
    }

    let finalCategoryId = categoryId;
    if (subCategoryId) {
      const subCategory = await prisma.subCategory.findUnique({
        where: { id: subCategoryId },
      });
      if (!subCategory) {
        return res.status(404).json({ error: 'Sub-category not found' });
      }
      finalCategoryId = subCategory.categoryId;
    }

    const item = await prisma.item.create({
      data: {
        name,
        image,
        description,
        taxApplicability: taxApplicability || false,
        tax: taxApplicability ? tax : null,
        baseAmount,
        discount: discountAmount,
        totalAmount,
        categoryId: finalCategoryId,
        subCategoryId: subCategoryId || null,
      },
      include: {
        category: true,
        subCategory: true,
      },
    });

    res.status(201).json({
      message: 'Item created successfully',
      data: item,
    });
  } catch (error) {
    console.error('Error creating item:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Item with this name already exists' });
    }
    if (error.code === 'P2025' || error.code === 'P2003') { 
      return res.status(404).json({ error: 'The specified category or sub-category does not exist' });
    }
    res.status(500).json({ error: 'Failed to create item', message: error.message });
  }
};


const getAllItems = async (req, res) => {
  try {
    const items = await prisma.item.findMany({
      include: {
        category: true,
        subCategory: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      message: 'Items retrieved successfully',
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items', message: error.message });
  }
};

// Get all items under a category
const getItemsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const items = await prisma.item.findMany({
      where: {
        categoryId,
      },
      include: {
        category: true,
        subCategory: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.status(200).json({
      message: 'Items retrieved successfully',
      data: items,
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items', message: error.message });
  }
};

// Get all items under a sub-category
const getItemsBySubCategory = async (req, res) => {
  try {
    const { subCategoryId } = req.params;
    const items = await prisma.item.findMany({
      where: {
        subCategoryId,
      },
      include: {
        category: true,
        subCategory: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.status(200).json({
      message: 'Items retrieved successfully',
      data: items,
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items', message: error.message });
  }
};

// Get item by ID or name
const getItemByIdOrName = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await prisma.item.findFirst({
      where: {
        OR: [
          { id: id },
          { name: id },
        ],
      },
      include: {
        category: true,
        subCategory: true,
      },
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.status(200).json({
      message: 'Item retrieved successfully',
      data: item,
    });
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Failed to fetch item', message: error.message });
  }
};

// Search items by name
const searchItems = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ error: 'Search query name is required' });
    }

    const items = await prisma.item.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      include: {
        category: true,
        subCategory: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      message: 'Search completed successfully',
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error('Error searching items:', error);
    res.status(500).json({ error: 'Failed to search items', message: error.message });
  }
};

// Update item
const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      image, 
      description, 
      taxApplicability, 
      tax, 
      baseAmount, 
      discount 
    } = req.body;

    const existingItem = await prisma.item.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (image !== undefined) updateData.image = image;
    if (description !== undefined) updateData.description = description;
    if (taxApplicability !== undefined) updateData.taxApplicability = taxApplicability;
    if (tax !== undefined) updateData.tax = tax;
    if (baseAmount !== undefined) updateData.baseAmount = baseAmount;
    if (discount !== undefined) updateData.discount = discount;
    if (baseAmount !== undefined || discount !== undefined) {
      const newBaseAmount = baseAmount !== undefined ? baseAmount : existingItem.baseAmount;
      const newDiscount = discount !== undefined ? discount : existingItem.discount;
      updateData.totalAmount = newBaseAmount - newDiscount;
    }

    const item = await prisma.item.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        subCategory: true,
      },
    });

    res.status(200).json({
      message: 'Item updated successfully',
      data: item,
    });
  } catch (error) {
    console.error('Error updating item:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Item with this name already exists' });
    }
    res.status(500).json({ error: 'Failed to update item', message: error.message });
  }
};

module.exports = {
  createItem,
  getAllItems,
  getItemsByCategory,
  getItemsBySubCategory,
  getItemByIdOrName,
  searchItems,
  updateItem,
};

