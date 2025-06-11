import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Button, Box } from '@mui/material';
import { Favorite as FavoriteIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { removeFromFavorites } from '../store/slices/favoriteSlice';

const Favorites = () => {
  const dispatch = useDispatch();
  const { favorites } = useSelector((state) => state.favorites);

  const handleRemoveFromFavorites = (productId) => {
    dispatch(removeFromFavorites(productId));
  };

  if (favorites.length === 0) {
    return (
      <Container className="py-8">
        <Typography variant="h4" component="h1" className="text-center mb-8">
          Mes Favoris
        </Typography>
        <Box className="text-center">
          <Typography variant="h6" color="textSecondary">
            Vous n'avez pas encore de favoris
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <Typography variant="h4" component="h1" className="text-center mb-8">
        Mes Favoris
      </Typography>

      <Grid container spacing={4}>
        {favorites.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
              <CardMedia
                component="img"
                height="200"
                image={product.images[0] || 'https://via.placeholder.com/200'}
                alt={product.name}
                className="object-cover"
              />
              <CardContent className="flex-grow">
                <Typography gutterBottom variant="h6" component="h2">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" className="mb-4">
                  {product.description}
                </Typography>
                <div className="flex justify-between items-center">
                  <Typography variant="h6" color="primary">
                    {product.price.toFixed(2)} €
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleRemoveFromFavorites(product._id)}
                  >
                    Retirer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Favorites; 