const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Obtenir tous les avis d'un produit
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'firstName lastName')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Créer un nouvel avis
router.post('/', auth, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    // Vérifier si l'utilisateur a déjà laissé un avis
    const existingReview = await Review.findOne({
      user: req.user._id,
      product: productId
    });

    if (existingReview) {
      return res.status(400).json({ message: 'Vous avez déjà laissé un avis pour ce produit' });
    }

    // Vérifier si le produit existe
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    const review = new Review({
      user: req.user._id,
      product: productId,
      rating,
      comment
    });

    await review.save();

    // Ajouter l'avis au produit
    product.reviews.push(review._id);
    await product.save();

    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mettre à jour un avis
router.put('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!review) {
      return res.status(404).json({ message: 'Avis non trouvé' });
    }

    const { rating, comment } = req.body;
    review.rating = rating;
    review.comment = comment;

    await review.save();
    res.json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Supprimer un avis
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!review) {
      return res.status(404).json({ message: 'Avis non trouvé' });
    }

    // Supprimer l'avis du produit
    const product = await Product.findById(review.product);
    if (product) {
      product.reviews = product.reviews.filter(
        r => r.toString() !== review._id.toString()
      );
      await product.save();
    }

    await review.remove();
    res.json({ message: 'Avis supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtenir les avis d'un utilisateur
router.get('/user', auth, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate('product', 'name images')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 