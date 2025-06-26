import React, { useState, useMemo } from 'react'
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  InputAdornment,
} from '@mui/material'
import {
  Search,
  Home as HomeIcon,
  RecyclingOutlined,
  SchoolOutlined,
  HealthAndSafetyOutlined,
  BusinessOutlined,
  Groups,
  FilterList,
} from '@mui/icons-material'

interface Service {
  id: string
  title: string
  description: string
  category: string
  link: string
  popular?: boolean
}

const Services: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const serviceCategories = [
    {
      id: 'housing-planning',
      name: 'Housing & Planning',
      icon: <HomeIcon />,
      color: '#1B5E20',
    },
    {
      id: 'environment-transport',
      name: 'Environment & Transport',
      icon: <RecyclingOutlined />,
      color: '#2E7D32',
    },
    {
      id: 'children-families',
      name: 'Children & Families',
      icon: <SchoolOutlined />,
      color: '#388E3C',
    },
    {
      id: 'adult-social-care',
      name: 'Adult Social Care',
      icon: <HealthAndSafetyOutlined />,
      color: '#4CAF50',
    },
    {
      id: 'business-licensing',
      name: 'Business & Licensing',
      icon: <BusinessOutlined />,
      color: '#66BB6A',
    },
    {
      id: 'community-leisure',
      name: 'Community & Leisure',
      icon: <Groups />,
      color: '#81C784',
    },
  ]

  const services: Service[] = [
    // Housing & Planning
    {
      id: 'planning-applications',
      title: 'Planning Applications',
      description: 'Submit and track planning permission applications for your property development projects.',
      category: 'housing-planning',
      link: '/my-applications',
      popular: true,
    },
    {
      id: 'building-control',
      title: 'Building Control',
      description: 'Building regulations approval and inspection services for construction projects.',
      category: 'housing-planning',
      link: '#',
    },
    {
      id: 'housing-services',
      title: 'Housing Services',
      description: 'Council housing, housing benefit applications, and housing advice services.',
      category: 'housing-planning',
      link: '#',
    },
    {
      id: 'council-tax',
      title: 'Council Tax',
      description: 'Council tax payments, exemptions, discounts, and billing inquiries.',
      category: 'housing-planning',
      link: '/council-tax',
      popular: true,
    },
    
    // Environment & Transport
    {
      id: 'waste-recycling',
      title: 'Waste & Recycling',
      description: 'Bin collection schedules, recycling information, and waste disposal services.',
      category: 'environment-transport',
      link: '#',
      popular: true,
    },
    {
      id: 'roads-transport',
      title: 'Roads & Transport',
      description: 'Report road issues, traffic management, and public transport information.',
      category: 'environment-transport',
      link: '#',
    },
    {
      id: 'environmental-services',
      title: 'Environmental Services',
      description: 'Environmental health, noise complaints, and pollution reporting.',
      category: 'environment-transport',
      link: '#',
    },
    {
      id: 'parking',
      title: 'Parking',
      description: 'Parking permits, penalty charge notices, and parking enforcement.',
      category: 'environment-transport',
      link: '#',
    },

    // Children & Families
    {
      id: 'schools-education',
      title: 'Schools & Education',
      description: 'School admissions, educational support, and special educational needs services.',
      category: 'children-families',
      link: '#',
    },
    {
      id: 'childrens-services',
      title: 'Children\'s Services',
      description: 'Child protection, family support, and children in care services.',
      category: 'children-families',
      link: '#',
    },
    {
      id: 'family-support',
      title: 'Family Support',
      description: 'Parenting support, family centers, and early years services.',
      category: 'children-families',
      link: '#',
    },

    // Adult Social Care
    {
      id: 'care-services',
      title: 'Care Services',
      description: 'Adult social care assessments, care packages, and support services.',
      category: 'adult-social-care',
      link: '#',
    },
    {
      id: 'support-adults',
      title: 'Support for Adults',
      description: 'Disability support, mental health services, and independent living assistance.',
      category: 'adult-social-care',
      link: '#',
    },
    {
      id: 'health-wellbeing',
      title: 'Health & Wellbeing',
      description: 'Public health services, health promotion, and wellbeing programs.',
      category: 'adult-social-care',
      link: '#',
    },

    // Business & Licensing
    {
      id: 'business-support',
      title: 'Business Support',
      description: 'Business advice, grants, and support for local enterprises.',
      category: 'business-licensing',
      link: '#',
    },
    {
      id: 'licensing',
      title: 'Licensing',
      description: 'Alcohol licenses, taxi licenses, and other business licensing services.',
      category: 'business-licensing',
      link: '#',
    },
    {
      id: 'trading-standards',
      title: 'Trading Standards',
      description: 'Consumer protection, trading standards advice, and business compliance.',
      category: 'business-licensing',
      link: '#',
    },

    // Community & Leisure
    {
      id: 'libraries',
      title: 'Libraries',
      description: 'Library services, book borrowing, digital resources, and community events.',
      category: 'community-leisure',
      link: '#',
    },
    {
      id: 'parks-recreation',
      title: 'Parks & Recreation',
      description: 'Parks maintenance, sports facilities, and recreational activities.',
      category: 'community-leisure',
      link: '#',
    },
    {
      id: 'community-centers',
      title: 'Community Centers',
      description: 'Community facility booking, events, and local group support.',
      category: 'community-leisure',
      link: '#',
    },
    {
      id: 'events',
      title: 'Events',
      description: 'Local events, festivals, and community celebrations information.',
      category: 'community-leisure',
      link: '#',
    },
  ]

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = !selectedCategory || service.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory, services])

  const popularServices = services.filter(service => service.popular)

  const getCategoryInfo = (categoryId: string) => {
    return serviceCategories.find(cat => cat.id === categoryId)
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #388E3C 100%)',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h1"
            component="h1"
            gutterBottom
            sx={{
              textAlign: 'center',
              mb: 2,
              fontWeight: 700,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
            }}
          >
            Council Services
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{
              textAlign: 'center',
              opacity: 0.9,
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Find all the services and support you need from your local council in one convenient location
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: 6 }}>
        {/* Search & Filter Section */}
        <Box sx={{ mb: 6 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search for services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: 'white',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="category-select-label">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FilterList sx={{ mr: 1 }} />
                    Filter by Category
                  </Box>
                </InputLabel>
                <Select
                  labelId="category-select-label"
                  value={selectedCategory}
                  label="Filter by Category"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  sx={{
                    borderRadius: 2,
                    bgcolor: 'white',
                  }}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {serviceCategories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ mr: 1, color: category.color }}>
                          {category.icon}
                        </Box>
                        {category.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('')
                }}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  borderColor: '#2E7D32',
                  color: '#2E7D32',
                  '&:hover': {
                    borderColor: '#1B5E20',
                    bgcolor: 'rgba(27, 94, 32, 0.04)',
                  },
                }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Popular Services Section */}
        {!searchTerm && !selectedCategory && (
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{
                color: 'text.primary',
                fontWeight: 600,
                mb: 3,
              }}
            >
              Popular Services
            </Typography>
            <Grid container spacing={3}>
              {popularServices.map((service) => {
                const categoryInfo = getCategoryInfo(service.category)
                return (
                  <Grid item xs={12} sm={6} md={4} key={service.id}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 30px rgba(46, 125, 50, 0.15)',
                        },
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Box sx={{ color: categoryInfo?.color, mr: 1 }}>
                            {categoryInfo?.icon}
                          </Box>
                          <Chip
                            label="Popular"
                            size="small"
                            sx={{
                              bgcolor: '#4CAF50',
                              color: 'white',
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                        <Typography
                          variant="h6"
                          component="h3"
                          gutterBottom
                          sx={{
                            color: 'text.primary',
                            fontWeight: 600,
                            mb: 2,
                          }}
                        >
                          {service.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 3, lineHeight: 1.6 }}
                        >
                          {service.description}
                        </Typography>
                        <Button
                          variant="contained"
                          fullWidth
                          href={service.link}
                          sx={{
                            bgcolor: categoryInfo?.color,
                            '&:hover': {
                              bgcolor: '#1B5E20',
                            },
                            borderRadius: 2,
                            py: 1.2,
                            fontWeight: 600,
                          }}
                        >
                          Access Service
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>
          </Box>
        )}

        {/* All Services Section */}
        <Box>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{
              color: 'text.primary',
              fontWeight: 600,
              mb: 3,
            }}
          >
            {selectedCategory 
              ? `${getCategoryInfo(selectedCategory)?.name} Services`
              : searchTerm 
              ? `Search Results (${filteredServices.length})`
              : 'All Services'
            }
          </Typography>
          
          {filteredServices.length === 0 ? (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                px: 4,
              }}
            >
              <Typography
                variant="h5"
                color="text.secondary"
                gutterBottom
              >
                No services found
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                Try adjusting your search terms or clearing the filters
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('')
                }}
                sx={{
                  borderColor: '#2E7D32',
                  color: '#2E7D32',
                  '&:hover': {
                    borderColor: '#1B5E20',
                    bgcolor: 'rgba(27, 94, 32, 0.04)',
                  },
                }}
              >
                Clear Filters
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredServices.map((service) => {
                const categoryInfo = getCategoryInfo(service.category)
                return (
                  <Grid item xs={12} sm={6} md={4} key={service.id}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 30px rgba(46, 125, 50, 0.15)',
                        },
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Box sx={{ color: categoryInfo?.color, mr: 1 }}>
                            {categoryInfo?.icon}
                          </Box>
                          <Chip
                            label={categoryInfo?.name}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderColor: categoryInfo?.color,
                              color: categoryInfo?.color,
                              ml: 'auto',
                            }}
                          />
                        </Box>
                        <Typography
                          variant="h6"
                          component="h3"
                          gutterBottom
                          sx={{
                            color: 'text.primary',
                            fontWeight: 600,
                            mb: 2,
                          }}
                        >
                          {service.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 3, lineHeight: 1.6 }}
                        >
                          {service.description}
                        </Typography>
                        <Button
                          variant="contained"
                          fullWidth
                          href={service.link}
                          sx={{
                            bgcolor: categoryInfo?.color,
                            '&:hover': {
                              bgcolor: '#1B5E20',
                            },
                            borderRadius: 2,
                            py: 1.2,
                            fontWeight: 600,
                          }}
                        >
                          Access Service
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>
          )}
        </Box>
      </Container>
    </Box>
  )
}

export default Services