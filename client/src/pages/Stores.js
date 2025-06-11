import React from 'react';
import { Container, Typography, Grid, Card, CardContent, Box } from '@mui/material';
import { LocationOn, Phone, AccessTime } from '@mui/icons-material';

const stores = [
  {
    id: 1,
    name: 'Paris - Champs-Élysées',
    address: '123 Avenue des Champs-Élysées, 75008 Paris',
    phone: '01 23 45 67 89',
    hours: 'Lun-Sam: 10h-20h, Dim: 11h-19h'
  },
  {
    id: 2,
    name: 'Lyon - Part-Dieu',
    address: '45 Rue de la Part-Dieu, 69003 Lyon',
    phone: '04 56 78 90 12',
    hours: 'Lun-Sam: 10h-20h, Dim: 11h-19h'
  },
  {
    id: 3,
    name: 'Marseille - Vieux Port',
    address: '78 Quai du Port, 13002 Marseille',
    phone: '04 91 23 45 67',
    hours: 'Lun-Sam: 10h-20h, Dim: 11h-19h'
  },
  {
    id: 4,
    name: 'Bordeaux - Saint-Catherine',
    address: '56 Rue Sainte-Catherine, 33000 Bordeaux',
    phone: '05 56 78 90 12',
    hours: 'Lun-Sam: 10h-20h, Dim: 11h-19h'
  },
  {
    id: 5,
    name: 'Lille - Grand Place',
    address: '34 Place du Général de Gaulle, 59000 Lille',
    phone: '03 20 12 34 56',
    hours: 'Lun-Sam: 10h-20h, Dim: 11h-19h'
  }
];

const Stores = () => {
  return (
    <Container className="py-8">
      <Typography variant="h4" component="h1" className="text-center mb-8">
        Nos Magasins
      </Typography>

      <Grid container spacing={4}>
        {stores.map((store) => (
          <Grid item xs={12} md={6} key={store.id}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent>
                <Typography variant="h5" component="h2" className="mb-4">
                  {store.name}
                </Typography>
                
                <Box className="space-y-2">
                  <div className="flex items-start">
                    <LocationOn className="text-gray-500 mr-2 mt-1" />
                    <Typography variant="body1">
                      {store.address}
                    </Typography>
                  </div>

                  <div className="flex items-center">
                    <Phone className="text-gray-500 mr-2" />
                    <Typography variant="body1">
                      {store.phone}
                    </Typography>
                  </div>

                  <div className="flex items-center">
                    <AccessTime className="text-gray-500 mr-2" />
                    <Typography variant="body1">
                      {store.hours}
                    </Typography>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Stores; 