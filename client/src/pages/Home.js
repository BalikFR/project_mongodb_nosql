import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../store/slices/productSlice';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Container,
  Button,
  Box,
  Chip,
  IconButton,
  Rating,
  CardActions,
  Fade
} from '@mui/material';
import {
  Add as AddIcon,
  Favorite as FavoriteIcon,
  ShoppingCart as ShoppingCartIcon,
  LocalOffer as LocalOfferIcon
} from '@mui/icons-material';

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) {
    return (
      <Container className="py-8">
        <Box className="flex justify-center items-center min-h-[60vh]">
          <Typography variant="h5" className="text-gray-400 font-light">
            Chargement...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-8">
        <Box className="flex justify-center items-center min-h-[60vh]">
          <Typography variant="h5" color="error" className="text-center font-light">
            {error}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box className="bg-white min-h-screen">
      <Container maxWidth="xl" className="py-16">
        <Box className="flex justify-between items-center mb-16">
          <Typography 
            variant="h2" 
            component="h1" 
            className="font-light text-gray-900"
          >
            Découvrez notre collection
          </Typography>
          <Button
            component={Link}
            to="/add-product"
            variant="contained"
            className="bg-black hover:bg-gray-800 text-white font-light px-8 py-2 rounded-full transition-all duration-300"
            startIcon={<AddIcon />}
          >
            Ajouter un produit
          </Button>
        </Box>

        {products && products.length > 0 ? (
          <Grid container spacing={6}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <Fade in={true} timeout={500}>
                  <Card className="h-full flex flex-col group hover:shadow-lg transition-all duration-300 bg-white border border-gray-100">
                    <Box className="relative overflow-hidden">
                      <CardMedia
                        component="img"
                        height="320"
                        image={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/320'}
                        alt={product.name}
                        className="object-cover h-[320px] transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <Box className="absolute top-4 right-4 flex gap-2">
                        <IconButton 
                          size="small"
                          className="bg-white/90 hover:bg-white transition-all duration-300"
                        >
                          <FavoriteIcon className="text-gray-600" />
                        </IconButton>
                        <IconButton 
                          size="small"
                          className="bg-white/90 hover:bg-white transition-all duration-300"
                        >
                          <ShoppingCartIcon className="text-gray-600" />
                        </IconButton>
                      </Box>
                      {product.stock < 10 && (
                        <Chip
                          label="Stock limité"
                          size="small"
                          className="absolute top-4 left-4 bg-black/80 text-white font-light"
                        />
                      )}
                    </Box>
                    <CardContent className="flex-grow p-6">
                      <Typography 
                        gutterBottom 
                        variant="h6" 
                        component="h2"
                        className="font-light text-gray-900"
                      >
                        {product.name}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        className="mb-4 text-gray-500 font-light"
                      >
                        {product.description}
                      </Typography>
                      <Box className="flex items-center gap-2 mb-2">
                        <LocalOfferIcon className="text-gray-400" fontSize="small" />
                        <Typography variant="body2" className="text-gray-500 font-light">
                          {product.brand}
                        </Typography>
                      </Box>
                      <Box className="flex items-center justify-between">
                        <Typography variant="h6" className="font-light text-gray-900">
                          {product.price.toFixed(2)} €
                        </Typography>
                        <Rating value={4} readOnly size="small" className="text-gray-300" />
                      </Box>
                    </CardContent>
                    <CardActions className="p-6 pt-0">
                      <Button
                        fullWidth
                        variant="outlined"
                        className="border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 font-light transition-all duration-300"
                      >
                        Voir les détails
                      </Button>
                    </CardActions>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box className="flex justify-center items-center min-h-[60vh]">
            <Typography variant="h6" className="text-gray-400 font-light">
              Aucun produit disponible
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Home; 