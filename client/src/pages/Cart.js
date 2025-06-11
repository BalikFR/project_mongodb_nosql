import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Box,
  Button,
  Divider,
  TextField
} from '@mui/material';
import { Delete, Add, Remove } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../store/slices/cartSlice';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector((state) => state.cart);

  const handleQuantityChange = (productId, size, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ productId, size, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (productId, size) => {
    dispatch(removeFromCart({ productId, size }));
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Votre panier est vide
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/products')}
        >
          Continuer vos achats
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Votre panier
      </Typography>

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          {items.map((item) => (
            <Card key={`${item.product._id}-${item.size}`} sx={{ mb: 2 }}>
              <Grid container>
                <Grid item xs={4}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={item.product.images[0]}
                    alt={item.product.name}
                  />
                </Grid>
                <Grid item xs={8}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {item.product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Taille: {item.size}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Prix: {item.product.price} €
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item.product._id, item.size, item.quantity - 1)}
                      >
                        <Remove />
                      </IconButton>
                      <TextField
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.product._id, item.size, parseInt(e.target.value))}
                        type="number"
                        inputProps={{ min: 1 }}
                        sx={{ width: 60, mx: 1 }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item.product._id, item.size, item.quantity + 1)}
                      >
                        <Add />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveItem(item.product._id, item.size)}
                        sx={{ ml: 2 }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Grid>
              </Grid>
            </Card>
          ))}
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Résumé de la commande
              </Typography>
              <Box sx={{ my: 2 }}>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Typography>Sous-total</Typography>
                  </Grid>
                  <Grid item>
                    <Typography>{totalAmount} €</Typography>
                  </Grid>
                </Grid>
                <Grid container justifyContent="space-between" sx={{ mt: 1 }}>
                  <Grid item>
                    <Typography>Livraison</Typography>
                  </Grid>
                  <Grid item>
                    <Typography>Gratuite</Typography>
                  </Grid>
                </Grid>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Grid container justifyContent="space-between">
                <Grid item>
                  <Typography variant="h6">Total</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h6">{totalAmount} €</Typography>
                </Grid>
              </Grid>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={() => navigate('/checkout')}
                sx={{ mt: 2 }}
              >
                Passer la commande
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart; 