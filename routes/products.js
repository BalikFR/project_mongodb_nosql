const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');

// Get all products with filters
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all products...');
    const { category, minPrice, maxPrice, brand, size, color, page = 1, limit = 10 } = req.query;
    const query = {};

    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (size) query.sizes = size;
    if (color) query.colors = color;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(query)
      .populate('category')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Product.countDocuments(query);

    console.log('Found products:', products);
    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create a new product
router.post('/', async (req, res) => {
  try {
    console.log('Received product data:', req.body);

    // Trouver une catégorie par défaut
    const category = await Category.findOne();
    if (!category) {
      console.log('No category found, creating default category...');
      const defaultCategory = new Category({ name: 'Vêtements' });
      await defaultCategory.save();
      console.log('Default category created:', defaultCategory);
    }

    // Créer le produit
    const product = new Product({
      ...req.body,
      category: category ? category._id : defaultCategory._id
    });

    console.log('Creating product:', product);
    const newProduct = await product.save();
    console.log('Product created successfully:', newProduct);

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get a single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const result = await Product.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 