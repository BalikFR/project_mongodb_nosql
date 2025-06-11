const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middleware/auth');

// Obtenir toutes les catégories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find()
      .populate('parentCategory', 'name')
      .sort('name');
    
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtenir une catégorie spécifique avec ses produits
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('parentCategory', 'name')
      .populate('products');
    
    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }
    
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Créer une nouvelle catégorie (admin seulement)
router.post('/', auth, async (req, res) => {
  try {
    const category = new Category(req.body);
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mettre à jour une catégorie (admin seulement)
router.put('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }
    
    res.json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Supprimer une catégorie (admin seulement)
router.delete('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }

    // Vérifier s'il y a des sous-catégories
    const hasSubCategories = await Category.exists({ parentCategory: category._id });
    if (hasSubCategories) {
      return res.status(400).json({ message: 'Impossible de supprimer une catégorie avec des sous-catégories' });
    }

    // Vérifier s'il y a des produits
    if (category.products.length > 0) {
      return res.status(400).json({ message: 'Impossible de supprimer une catégorie contenant des produits' });
    }

    await category.remove();
    res.json({ message: 'Catégorie supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtenir l'arborescence des catégories
router.get('/tree', async (req, res) => {
  try {
    const categories = await Category.find()
      .populate('parentCategory', 'name')
      .sort('name');

    const buildTree = (categories, parentId = null) => {
      return categories
        .filter(category => category.parentCategory?._id.toString() === parentId?.toString())
        .map(category => ({
          ...category.toObject(),
          children: buildTree(categories, category._id)
        }));
    };

    const tree = buildTree(categories);
    res.json(tree);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 