const mongoose = require('mongoose');
const Category = require('./models/Category');

mongoose.connect('mongodb://localhost:27017/fashion-ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Vérifier si une catégorie existe déjà
    const existingCategory = await Category.findOne();
    
    if (!existingCategory) {
      // Créer une catégorie par défaut
      const defaultCategory = new Category({
        name: 'Vêtements'
      });
      
      await defaultCategory.save();
      console.log('Default category created successfully');
    } else {
      console.log('Default category already exists');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
}); 