import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Rating,
  TextField,
  Divider,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { createReview } from '../store/slices/reviewSlice';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProduct: product, loading, error } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Veuillez sélectionner une taille');
      return;
    }
    dispatch(addToCart({
      product: product._id,
      size: selectedSize,
      quantity
    }));
    navigate('/cart');
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    dispatch(createReview({
      product: product._id,
      rating: reviewRating,
      text: reviewText
    }));
    setReviewRating(0);
    setReviewText('');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={product.images[0]}
            alt={product.name}
            sx={{
              width: '100%',
              height: 'auto',
              borderRadius: 2
            }}
          />
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            {product.name}
          </Typography>
          <Typography variant="h5" color="primary" gutterBottom>
            {product.price} €
          </Typography>
          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>

          {/* Size Selection */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Taille</InputLabel>
            <Select
              value={selectedSize}
              label="Taille"
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              {product.sizes.map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Quantity Selection */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Quantité
            </Typography>
            <TextField
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
              inputProps={{ min: 1 }}
              sx={{ width: 100 }}
            />
          </Box>

          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleAddToCart}
            sx={{ mb: 4 }}
          >
            Ajouter au panier
          </Button>

          {/* Reviews Section */}
          <Divider sx={{ my: 4 }} />
          <Typography variant="h6" gutterBottom>
            Avis clients
          </Typography>

          {isAuthenticated && (
            <Box component="form" onSubmit={handleReviewSubmit} sx={{ mb: 4 }}>
              <Rating
                value={reviewRating}
                onChange={(e, newValue) => setReviewRating(newValue)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Partagez votre expérience..."
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={!reviewRating || !reviewText}
              >
                Publier un avis
              </Button>
            </Box>
          )}

          {product.reviews?.map((review) => (
            <Box key={review._id} sx={{ mb: 2 }}>
              <Rating value={review.rating} readOnly />
              <Typography variant="body2" color="text.secondary">
                {review.text}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Par {review.user.name} le {new Date(review.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail; 