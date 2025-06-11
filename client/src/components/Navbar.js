import React from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container
} from '@mui/material';
import { ShoppingBag as ShoppingBagIcon } from '@mui/icons-material';

const Navbar = () => {
  return (
    <AppBar position="static" className="bg-white shadow-sm">
      <Container maxWidth="xl">
        <Toolbar className="px-0">
          <Box className="flex items-center gap-3">
            <ShoppingBagIcon className="text-gray-900" />
            <Typography 
              variant="h6" 
              component={Link} 
              to="/"
              className="font-light text-gray-900 no-underline hover:opacity-80 transition-opacity duration-300"
            >
              Fashion Store
            </Typography>
          </Box>

          <Box className="flex-grow" />

          <Button
            component={Link}
            to="/add-product"
            variant="contained"
            className="bg-black hover:bg-gray-800 text-white font-light px-6 py-1.5 rounded-full transition-all duration-300"
          >
            Ajouter un produit
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 