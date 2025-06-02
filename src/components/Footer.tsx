import React from 'react'
import { Box, Container, Typography, Link, Divider, Grid } from '@mui/material'
import { Nature, Email, Phone, LocationOn, Facebook, Twitter } from '@mui/icons-material'

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        background: 'white', // Set background to white
        color: 'black', // Ensure text is not white
        py: 6,
        mt: 'auto',
        position: 'relative',
        overflow: 'hidden',
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
          backgroundImage: `url('data:image/svg+xml,<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><g fill="%23ffffff" fill-opacity="0.05"><path d="M20 20c0-11.046 8.954-20 20-20v20H20z"/></g></svg>')`,
          backgroundRepeat: 'repeat',
        }}
      />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4}>
          {/* Council Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box 
                sx={{
                  background: 'linear-gradient(135deg, #66BB6A, #4CAF50)',
                  borderRadius: '50%',
                  p: 1,
                  mr: 2,
                }}
              >
                <Nature sx={{ color: 'white', fontSize: '1.8rem' }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Contoso Council
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Planning & Environment Department
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
              Committed to sustainable development that preserves our natural environment 
              while meeting the needs of our growing community.
            </Typography>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Contact Information
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOn sx={{ mr: 1, fontSize: '1.2rem', opacity: 0.8 }} />
              <Typography variant="body2">
                123 Green Street, Eco City, EC1 2AB
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Phone sx={{ mr: 1, fontSize: '1.2rem', opacity: 0.8 }} />
              <Typography variant="body2">
                +44 (0) 123 456 7890
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Email sx={{ mr: 1, fontSize: '1.2rem', opacity: 0.8 }} />
              <Typography variant="body2">
                planning@contoso.gov.uk
              </Typography>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/privacy" color="inherit" underline="hover" sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}>
                Privacy Policy
              </Link>
              <Link href="/terms" color="inherit" underline="hover" sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}>
                Terms of Service
              </Link>
              <Link href="/accessibility" color="inherit" underline="hover" sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}>
                Accessibility Statement
              </Link>
              <Link href="/contact" color="inherit" underline="hover" sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}>
                Contact Us
              </Link>
              <Link href="/environmental-policy" color="inherit" underline="hover" sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}>
                Environmental Policy
              </Link>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ bgcolor: 'rgba(0,0,0,0.2)', my: 3 }} />
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © {new Date().getFullYear()} Contoso Council. All rights reserved. 
            <br />
            <Box component="span" sx={{ fontSize: '0.8rem' }}>
              🌱 Committed to carbon neutral planning by 2030
            </Box>
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Box 
              sx={{
                p: 1,
                borderRadius: '50%',
                backgroundColor: 'rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              <Facebook sx={{ fontSize: '1.2rem' }} />
            </Box>
            <Box 
              sx={{
                p: 1,
                borderRadius: '50%',
                backgroundColor: 'rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              <Twitter sx={{ fontSize: '1.2rem' }} />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
