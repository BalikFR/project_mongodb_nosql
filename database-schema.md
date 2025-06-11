# Schéma de la Base de Données MongoDB

## Collections et Relations

### 1. Products (Vêtements)
```json
{
  "_id": ObjectId,
  "name": String,
  "description": String,
  "price": Number,
  "category": ObjectId,  // Référence à Categories
  "brand": String,
  "sizes": [String],
  "colors": [String],
  "images": [String],
  "stock": Number,
  "rating": Number,
  "reviews": [ObjectId],  // Référence à Reviews
  "createdAt": Date,
  "updatedAt": Date
}
```

### 2. Categories
```json
{
  "_id": ObjectId,
  "name": String,
  "description": String,
  "parentCategory": ObjectId,  // Auto-référence pour les sous-catégories
  "products": [ObjectId],  // Référence à Products
  "createdAt": Date
}
```

### 3. Users
```json
{
  "_id": ObjectId,
  "email": String,
  "password": String,
  "firstName": String,
  "lastName": String,
  "address": {
    "street": String,
    "city": String,
    "postalCode": String,
    "country": String
  },
  "orders": [ObjectId],  // Référence à Orders
  "favorites": [ObjectId],  // Référence à Products
  "createdAt": Date
}
```

### 4. Orders
```json
{
  "_id": ObjectId,
  "user": ObjectId,  // Référence à Users
  "products": [{
    "product": ObjectId,  // Référence à Products
    "quantity": Number,
    "price": Number
  }],
  "totalAmount": Number,
  "status": String,
  "shippingAddress": {
    "street": String,
    "city": String,
    "postalCode": String,
    "country": String
  },
  "createdAt": Date
}
```

### 5. Reviews
```json
{
  "_id": ObjectId,
  "product": ObjectId,  // Référence à Products
  "user": ObjectId,  // Référence à Users
  "rating": Number,
  "comment": String,
  "createdAt": Date
}
```

## Relations Principales
1. Products -> Categories (Many-to-One)
2. Products -> Reviews (One-to-Many)
3. Users -> Orders (One-to-Many)
4. Users -> Favorites (Many-to-Many avec Products)
5. Categories -> Parent Categories (Self-referencing)

## Indexes Recommandés
1. Products: name, category, price
2. Users: email
3. Orders: user, createdAt
4. Reviews: product, rating
5. Categories: name, parentCategory 