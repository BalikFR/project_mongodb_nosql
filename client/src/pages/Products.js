import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Pagination,
  CircularProgress
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import { fetchCategories } from '../store/slices/categorySlice';

const Products = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading, totalPages, currentPage } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (sort) params.set('sort', sort);
    setSearchParams(params);

    dispatch(fetchProducts({
      search,
      category,
      sort,
      page: currentPage
    }));
  }, [dispatch, search, category, sort, currentPage, setSearchParams]);

  const handlePageChange = (event, value) => {
    navigate(`/products?page=${value}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Catalogue
      </Typography>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Rechercher"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Catégorie</InputLabel>
            <Select
              value={category}
              label="Catégorie"
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="">Toutes les catégories</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Trier par</InputLabel>
            <Select
              value={sort}
              label="Trier par"
              onChange={(e) => setSort(e.target.value)}
            >
              <MenuItem value="newest">Plus récent</MenuItem>
              <MenuItem value="price_asc">Prix croissant</MenuItem>
              <MenuItem value="price_desc">Prix décroissant</MenuItem>
              <MenuItem value="name_asc">Nom A-Z</MenuItem>
              <MenuItem value="name_desc">Nom Z-A</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Products Grid */}
      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer'
              }}
              onClick={() => navigate(`/products/${product._id}`)}
            >
              <CardMedia
                component="img"
                height="200"
                image={product.images[0]}
                alt={product.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="h3">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.price} €
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {product.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
};

export default Products; 