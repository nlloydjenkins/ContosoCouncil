import React from 'react'
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
} from '@mui/material'
import { Link } from 'react-router-dom'
import {
  Assignment,
  CloudUpload,
  Info,
  Timeline,
  CheckCircle,
  Support,
  Nature,
  Park,
} from '@mui/icons-material'

const Home: React.FC = () => {
  const quickLinks = [
    {
      title: 'My Applications',
      description: 'View and track your planning applications',
      icon: <Assignment fontSize="large" />,
      link: '/my-applications',
      color: '#2E7D32',
    },
    {
      title: 'Upload Documents',
      description: 'Submit supporting documents for your application',
      icon: <CloudUpload fontSize="large" />,
      link: '/upload',
      color: '#4CAF50',
    },
    {
      title: 'How It Works',
      description: 'Learn about the planning permission process',
      icon: <Info fontSize="large" />,
      link: '/how-it-works',
      color: '#66BB6A',
    },
  ]

  const features = [
    {
      icon: <Timeline fontSize="large" />,
      title: 'Track Progress',
      description: 'Monitor your application status in real-time',
    },
    {
      icon: <CheckCircle fontSize="large" />,
      title: 'Quick Approvals',
      description: 'Streamlined process for faster decisions',
    },
    {
      icon: <Support fontSize="large" />,
      title: '24/7 Support',
      description: 'Get help anytime with our AI assistant',
    },
  ]

  return (
    <Box>
      {/* Hero Section */}
      <Box
        className="hero-section"
        sx={{
          background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 25%, #4CAF50 50%, #66BB6A 75%, rgba(241, 248, 233, 0.9) 100%)',
          color: 'white',
          py: 8,
          px: 4,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  backgroundColor: '#f5f5f5',
                  px: 3,
                  py: 1.5,
                  borderRadius: 4,
                  border: '1px solid #e0e0e0'
                }}
              >
                <Nature className="tree-icon" sx={{ fontSize: '2rem', color: '#66BB6A' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Protecting Our Natural Environment
                </Typography>
              </Box>
            </Box>
            
            <Typography variant="h1" gutterBottom sx={{ 
              color: '#1B5E20',
              fontWeight: 800,
              mb: 3
            }}>
              Contoso Council
            </Typography>
            <Typography variant="h2" sx={{ color: 'white' }}>
              Planning for a Sustainable Future
            </Typography>
            <Typography variant="body1" sx={{ 
              mb: 5, 
              maxWidth: '700px', 
              mx: 'auto',
              fontSize: '1.2rem',
              lineHeight: 1.7,
              textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
            }}>
              Submit applications, track progress, and collaborate with our environmental planning team 
              to create developments that harmonize with nature. Making sustainable planning permission 
              simple, transparent, and community-focused.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={Link}
                to="/my-applications"
                variant="contained"
                size="large"
                className="eco-button"
                sx={{
                  bgcolor: 'white',
                  color: '#1B5E20',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: '#F1F8E9',
                    color: '#1B5E20',
                    transform: 'translateY(-2px)',
                  },
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                }}
                startIcon={<Assignment />}
              >
                View My Applications
              </Button>
              
              <Button
                component={Link}
                to="/how-it-works"
                variant="outlined"
                size="large"
                className="eco-button"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  },
                }}
                startIcon={<Park />}
              >
                Learn About Our Process
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Quick Links */}
        <Typography variant="h2" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
          Quick Links
        </Typography>
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {quickLinks.map((link, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                className="nature-card fade-in"
                sx={{
                  height: '100%',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  animationDelay: `${index * 0.1}s`,
                }}
                component={Link}
              to={link.link}
              style={{ textDecoration: 'none' }}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Box sx={{ color: link.color, mb: 2 }}>
                  {link.icon}
                </Box>
                <Typography variant="h5" gutterBottom>
                  {link.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {link.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Features Section */}
      <Typography variant="h2" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
        Why Choose Our Portal?
      </Typography>
      <Grid container spacing={3}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Box 
              className="grow-in"
              sx={{ 
                textAlign: 'center', 
                p: 3,
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <Box 
                sx={{ 
                  color: 'primary.main', 
                  mb: 2,
                  '& svg': {
                    fontSize: '3rem',
                  }
                }}
              >
                {feature.icon}
              </Box>
              <Typography variant="h6" gutterBottom color="primary.main">
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
      </Container>
    </Box>
  )
}

export default Home
