import React from 'react';
import { Box, Typography } from '@mui/material';
import { Nature, LocationCity } from '@mui/icons-material';

const Logo: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        background: 'linear-gradient(145deg, #1B5E20 0%, #2E7D32 25%, #4CAF50 50%, #66BB6A 75%, #81C784 100%)',
        borderRadius: '20px',
        padding: '12px 20px',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3), inset 0 1px 3px rgba(255, 255, 255, 0.2)',
        position: 'relative',
        overflow: 'hidden',
        border: '2px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Background pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url('data:image/svg+xml,<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.05"><circle cx="20" cy="20" r="3"/><circle cx="5" cy="5" r="2"/><circle cx="35" cy="35" r="2"/><circle cx="5" cy="35" r="1"/><circle cx="35" cy="5" r="1"/></g></g></svg>')`,
          backgroundRepeat: 'repeat',
        }}
      />
      
      {/* Complex logo icon with multiple elements */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '60px',
          height: '60px',
          background: 'linear-gradient(135deg, #66BB6A 0%, #4CAF50 50%, #2E7D32 100%)',
          borderRadius: '50%',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
          position: 'relative',
          border: '3px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        {/* Background city silhouette */}
        <LocationCity 
          sx={{ 
            position: 'absolute',
            color: 'rgba(255, 255, 255, 0.3)', 
            fontSize: '1.8rem',
            transform: 'translate(-2px, 2px)'
          }} 
        />
        {/* Foreground nature icon */}
        <Nature 
          sx={{ 
            color: 'white', 
            fontSize: '2.2rem',
            position: 'relative',
            zIndex: 1,
            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
          }} 
        />
      </Box>
      
      {/* Text content */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: 'white',
            textShadow: '0 3px 6px rgba(0, 0, 0, 0.4)',
            letterSpacing: '0.5px',
            background: 'linear-gradient(45deg, #ffffff 30%, #f0f8ff 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '1.8rem',
            lineHeight: 1.2,
          }}
        >
          Contoso Council
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
            fontWeight: 500,
            fontSize: '0.85rem',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}
        >
          Planning & Environment
        </Typography>
      </Box>
    </Box>
  );
};

export default Logo;
