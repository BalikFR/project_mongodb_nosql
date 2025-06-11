const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Créer une nouvelle commande
router.post('/', auth, async (req, res) => {
  try {
    const { products, shippingAddress } = req.body;

    // Vérifier le stock et calculer le total
    let totalAmount = 0;
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ message: `Produit ${item.product} non trouvé` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Stock insuffisant pour ${product.name}` });
      }
      totalAmount += product.price * item.quantity;
      
      // Mettre à jour le stock
      product.stock -= item.quantity;
      await product.save();
    }

    const order = new Order({
      user: req.user._id,
      products,
      totalAmount,
      shippingAddress
    });

    await order.save();

    // Ajouter la commande à l'historique de l'utilisateur
    req.user.orders.push(order._id);
    await req.user.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Obtenir toutes les commandes de l'utilisateur
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate({
        path: 'products.product',
        select: 'name price images'
      })
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtenir une commande spécifique
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate({
      path: 'products.product',
      select: 'name price images description'
    });

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mettre à jour le statut d'une commande (admin seulement)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Annuler une commande
router.post('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Cette commande ne peut plus être annulée' });
    }

    // Remettre les produits en stock
    for (const item of order.products) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    order.status = 'cancelled';
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 