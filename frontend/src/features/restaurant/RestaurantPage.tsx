import { Box, Typography, Paper } from '@mui/material';

const RestaurantPage = () => {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Restaurant Settings
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Restaurant settings and configuration will be implemented here.
        </Typography>
      </Paper>
    </Box>
  );
};

export default RestaurantPage;
