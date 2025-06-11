const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');

const categories = [
  {
    name: 'Homme',
    description: 'Vêtements pour homme'
  },
  {
    name: 'Femme',
    description: 'Vêtements pour femme'
  },
  {
    name: 'Enfant',
    description: 'Vêtements pour enfant'
  }
];

const products = [
  {
    name: 'T-shirt Basic',
    description: 'T-shirt en coton de haute qualité',
    price: 29.99,
    brand: 'Fashion Brand',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Noir', 'Blanc', 'Bleu'],
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    ],
    stock: 100
  },
  {
    name: 'Jean Slim',
    description: 'Jean slim stretch confortable',
    price: 79.99,
    brand: 'Denim Co',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Bleu', 'Noir'],
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    ],
    stock: 50
  },
  {
    name: 'Robe d\'été',
    description: 'Robe légère parfaite pour l\'été',
    price: 59.99,
    brand: 'Summer Style',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Rouge', 'Blanc', 'Rose'],
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    ],
    stock: 75
  }
];

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin'
  },
  {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'user'
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('Cleared existing data');

    // Create categories
    const createdCategories = await Category.create(categories);
    console.log('Created categories');

    // Create products with category references
    const productsWithCategories = products.map((product, index) => ({
      ...product,
      category: createdCategories[index % createdCategories.length]._id
    }));
    await Product.create(productsWithCategories);
    console.log('Created products');

    // Create users with hashed passwords
    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10)
      }))
    );
    await User.create(hashedUsers);
    console.log('Created users');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 