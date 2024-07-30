import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const LoadingAnimation = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '300px', // Adjust the height to match your layout
    }}
  >
    <CircularProgress />
  </Box>
);

export default LoadingAnimation;
