import React from 'react'
import { AppBar, Toolbar, Button, Box, Container } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import { Home, Assignment, Info, CloudUpload } from '@mui/icons-material'
import Logo from './Logo'

const Header: React.FC = () => {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home', icon: <Home sx={{ mr: 1 }} /> },
    { path: '/my-applications', label: 'My Applications', icon: <Assignment sx={{ mr: 1 }} /> },
    { path: '/how-it-works', label: 'How It Works', icon: <Info sx={{ mr: 1 }} /> },
    { path: '/upload', label: 'Upload Documents', icon: <CloudUpload sx={{ mr: 1 }} /> },
  ]

  return (
    <AppBar position="static" className="council-header">
      <Container maxWidth="xl">
        <Toolbar sx={{ py: 1 }}>
          <Box
            component={Link}
            to="/"
            className="council-logo"
            sx={{ flexGrow: 1, textDecoration: 'none' }}
          >
            <Logo />
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            {navItems.map((item) => (              <Button
                key={item.path}
                component={Link}
                to={item.path}
                className="eco-button"
                sx={{
                  color: 'white !important',
                  bgcolor: location.pathname === item.path 
                    ? 'rgba(255,255,255,0.2)' 
                    : 'transparent',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.15)',
                    transform: 'translateY(-1px)',
                    color: 'white !important',
                  },
                  '&:visited': {
                    color: 'white !important',
                  },
                  '&:link': {
                    color: 'white !important',
                  },
                  '& .MuiButton-startIcon': {
                    color: 'white !important',
                  },
                  borderRadius: 0,
                  px: 3,
                  py: 1.2,
                  fontWeight: 600,
                  textTransform: 'none',
                  backdropFilter: 'blur(10px)',
                  border: location.pathname === item.path 
                    ? '1px solid rgba(255,255,255,0.3)' 
                    : '1px solid transparent',
                  transition: 'all 0.3s ease',
                }}
                startIcon={item.icon}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Header
