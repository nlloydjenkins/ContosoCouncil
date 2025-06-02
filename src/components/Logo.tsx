import React from 'react';
import { Box, Typography } from '@mui/material';
import { Nature } from '@mui/icons-material';

const Logo: React.FC = () => {
  return (
    <Box      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        background: 'transparent',
        borderRadius: '8px',
        padding: '8px 16px',
      }}
    >      {/* Simple tree icon */}
      <Nature 
        sx={{ 
          color: 'white', 
          fontSize: '2rem',
        }} 
      />
      
      {/* Simple text */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color: 'white',
          fontSize: '1.5rem',
        }}
      >
        Contoso Council
      </Typography>
    </Box>
  );
};

export default Logo;
