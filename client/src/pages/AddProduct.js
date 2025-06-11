import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Fade,
  Alert,
  Snackbar
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    brand: '',
    sizes: [],
    colors: [],
    images: [''],
    stock: '',
    category: 'Homme'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value.split(',').map(item => item.trim())
    }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const removeImageField = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout du produit');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="md" className="py-12">
      <Fade in={true} timeout={500}>
        <Paper elevation={3} className="p-8 rounded-lg">
          <Typography 
            variant="h4" 
            component="h1" 
            className="mb-8 font-bold text-center bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent"
          >
            Ajouter un Nouveau Produit
          </Typography>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nom du produit"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="bg-white rounded-lg"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Marque"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                  className="bg-white rounded-lg"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  required
                  className="bg-white rounded-lg"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Prix"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  InputProps={{
                    endAdornment: <Typography>€</Typography>
                  }}
                  className="bg-white rounded-lg"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Stock"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  className="bg-white rounded-lg"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tailles (séparées par des virgules)"
                  value={formData.sizes.join(', ')}
                  onChange={(e) => handleArrayChange('sizes', e.target.value)}
                  required
                  className="bg-white rounded-lg"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Couleurs (séparées par des virgules)"
                  value={formData.colors.join(', ')}
                  onChange={(e) => handleArrayChange('colors', e.target.value)}
                  required
                  className="bg-white rounded-lg"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth className="bg-white rounded-lg">
                  <InputLabel>Catégorie</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="Homme">Homme</MenuItem>
                    <MenuItem value="Femme">Femme</MenuItem>
                    <MenuItem value="Enfant">Enfant</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Box className="space-y-4">
                  <Typography variant="subtitle1" className="font-semibold">
                    Images du produit
                  </Typography>
                  {formData.images.map((image, index) => (
                    <Box key={index} className="flex gap-2 items-center">
                      <TextField
                        fullWidth
                        label={`URL de l'image ${index + 1}`}
                        value={image}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        required
                        className="bg-white rounded-lg"
                      />
                      {index > 0 && (
                        <IconButton 
                          onClick={() => removeImageField(index)}
                          color="error"
                          className="bg-red-50 hover:bg-red-100"
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>
                  ))}
                  <Button
                    startIcon={<AddIcon />}
                    onClick={addImageField}
                    variant="outlined"
                    className="mt-2 border-purple-500 text-purple-500 hover:bg-purple-50"
                  >
                    Ajouter une image
                  </Button>
                </Box>
              </Grid>
            </Grid>

            <Box className="flex justify-end gap-4 mt-8">
              <Button
                variant="outlined"
                onClick={() => navigate('/')}
                className="border-gray-300 hover:border-gray-400"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="contained"
                className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transition-all duration-300"
              >
                Ajouter le produit
              </Button>
            </Box>
          </form>
        </Paper>
      </Fade>

      <Snackbar 
        open={success} 
        autoHideDuration={2000} 
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" className="w-full">
          Produit ajouté avec succès !
        </Alert>
      </Snackbar>

      {error && (
        <Alert severity="error" className="mt-4">
          {error}
        </Alert>
      )}
    </Container>
  );
};

export default AddProduct; 