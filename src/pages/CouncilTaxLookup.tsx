import React, { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  InputAdornment,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import {
  Search,
  Home as HomeIcon,
  AttachMoney,
  Info,
  LocationOn,
} from '@mui/icons-material'
import { Property, CouncilTaxBand, councilTaxService } from '../services/councilTaxService'

const CouncilTaxLookup: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Property[]>([])
  const [councilTaxBands, setCouncilTaxBands] = useState<CouncilTaxBand[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!searchQuery.trim()) {
      setError('Please enter an address or postcode to search')
      return
    }

    setLoading(true)
    setError('')
    setHasSearched(true)
    
    try {
      const results = await councilTaxService.searchProperties(searchQuery)
      setSearchResults(results)
      
      if (results.length === 0) {
        setError('No properties found for the given address or postcode. Please check your search terms and try again.')
      }
    } catch (err) {
      setError('An error occurred while searching. Please try again.')
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadCouncilTaxBands = async () => {
    if (councilTaxBands.length > 0) return // Already loaded
    
    try {
      const bands = await councilTaxService.getCouncilTaxBands()
      setCouncilTaxBands(bands)
    } catch (err) {
      console.error('Error loading council tax bands:', err)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount)
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
            Council Tax Lookup
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
            Find your council tax rate and band information by searching for your property address or postcode
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Search Form */}
        <Card
          elevation={2}
          sx={{
            mb: 4,
            border: '1px solid #C8E6C9',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ color: 'text.primary', mb: 3 }}>
              Search for Your Property
            </Typography>
            
            <Box component="form" onSubmit={handleSearch}>
              <Grid container spacing={3} alignItems="end">
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    label="Enter address or postcode"
                    placeholder="e.g., 123 Oak Street or CT1 2AB"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOn color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    aria-label="Property address or postcode search"
                    helperText="Enter your full address or postcode to find your council tax information"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <Search />}
                    sx={{
                      height: '56px',
                      background: 'linear-gradient(45deg, #2E7D32 30%, #388E3C 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1B5E20 30%, #2E7D32 90%)',
                      },
                    }}
                  >
                    {loading ? 'Searching...' : 'Search'}
                  </Button>
                </Grid>
              </Grid>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 3 }} role="alert">
                {error}
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Search Results */}
        {hasSearched && searchResults.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ color: 'text.primary', mb: 3 }}>
              Search Results ({searchResults.length} {searchResults.length === 1 ? 'property' : 'properties'} found)
            </Typography>
            
            <Grid container spacing={3}>
              {searchResults.map((property) => (
                <Grid item xs={12} md={6} key={property.id}>
                  <Card
                    elevation={2}
                    sx={{
                      border: '1px solid #C8E6C9',
                      '&:hover': {
                        boxShadow: '0 8px 30px rgba(46, 125, 50, 0.25)',
                        transform: 'translateY(-2px)',
                        transition: 'all 0.3s ease-in-out',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                        <HomeIcon sx={{ color: 'primary.main', mr: 2, mt: 0.5 }} />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" component="h3" gutterBottom sx={{ color: 'text.primary' }}>
                            {property.address}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {property.postcode} • {property.propertyType}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {property.description}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Box sx={{ mb: 2 }}>
                        <Chip
                          label={`Council Tax Band ${property.councilTaxBand}`}
                          color="primary"
                          variant="outlined"
                          sx={{ mb: 2 }}
                        />
                        
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#E8F5E8' }}>
                              <AttachMoney sx={{ color: 'success.main', mb: 1 }} />
                              <Typography variant="body2" color="text.secondary">
                                Annual Rate
                              </Typography>
                              <Typography variant="h6" sx={{ color: 'success.dark', fontWeight: 'bold' }}>
                                {formatCurrency(property.annualRate)}
                              </Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={6}>
                            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#E8F5E8' }}>
                              <AttachMoney sx={{ color: 'success.main', mb: 1 }} />
                              <Typography variant="body2" color="text.secondary">
                                Monthly Rate
                              </Typography>
                              <Typography variant="h6" sx={{ color: 'success.dark', fontWeight: 'bold' }}>
                                {formatCurrency(property.monthlyRate)}
                              </Typography>
                            </Paper>
                          </Grid>
                        </Grid>
                      </Box>

                      <Typography variant="body2" color="text.secondary">
                        <Info sx={{ fontSize: 16, mr: 1, verticalAlign: 'text-bottom' }} />
                        This rate is based on a full year. You may be eligible for discounts or exemptions.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Council Tax Bands Information */}
        <Card
          elevation={2}
          sx={{
            mb: 4,
            border: '1px solid #C8E6C9',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Info sx={{ color: 'primary.main', mr: 2 }} />
              <Typography variant="h4" component="h2" sx={{ color: 'text.primary' }}>
                Council Tax Bands Information
              </Typography>
            </Box>
            
            <Typography variant="body1" paragraph sx={{ mb: 3 }}>
              Council tax bands are based on property valuations as of April 1991 in England. Click below to view all band rates for the current tax year.
            </Typography>

            <Button
              variant="outlined"
              onClick={loadCouncilTaxBands}
              sx={{ mb: 3 }}
            >
              {councilTaxBands.length > 0 ? 'Hide Band Information' : 'Show All Council Tax Bands'}
            </Button>

            {councilTaxBands.length > 0 && (
              <TableContainer component={Paper} elevation={1}>
                <Table aria-label="Council tax bands information">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#E8F5E8' }}>
                      <TableCell><strong>Band</strong></TableCell>
                      <TableCell><strong>Property Value (1991)</strong></TableCell>
                      <TableCell align="right"><strong>Annual Rate</strong></TableCell>
                      <TableCell align="right"><strong>Monthly Rate</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {councilTaxBands.map((band) => (
                      <TableRow key={band.band} hover>
                        <TableCell>
                          <Chip label={band.band} color="primary" size="small" />
                        </TableCell>
                        <TableCell>{band.description}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'medium' }}>
                          {formatCurrency(band.annualRate)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'medium' }}>
                          {formatCurrency(band.monthlyRate)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        {/* Help and Information */}
        <Card
          elevation={2}
          sx={{
            mb: 4,
            border: '1px solid #C8E6C9',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ color: 'text.primary', mb: 3 }}>
              Need Help?
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
                  Discounts and Exemptions
                </Typography>
                <Typography variant="body2" paragraph color="text.secondary">
                  You may be eligible for council tax discounts or exemptions, including:
                </Typography>
                <Box component="ul" sx={{ pl: 2, color: 'text.secondary' }}>
                  <li>Single person discount (25% off)</li>
                  <li>Student exemptions</li>
                  <li>Disability reductions</li>
                  <li>Empty property discounts</li>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
                  Payment Options
                </Typography>
                <Typography variant="body2" paragraph color="text.secondary">
                  Council tax can be paid in various ways:
                </Typography>
                <Box component="ul" sx={{ pl: 2, color: 'text.secondary' }}>
                  <li>Monthly direct debit</li>
                  <li>Online payments</li>
                  <li>Phone payments</li>
                  <li>In-person at council offices</li>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
            
            <Typography variant="body2" color="text.secondary">
              For more information about council tax, exemptions, or to report changes to your circumstances, 
              please contact our council tax team or use our chatbot for immediate assistance.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default CouncilTaxLookup