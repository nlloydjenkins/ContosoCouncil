import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Chip,
  Grid,
  Paper,
  Divider,
} from '@mui/material'
import { Link } from 'react-router-dom'
import { Visibility, CloudUpload, Add } from '@mui/icons-material'
import { getApplications, Application } from '../services/applicationService'
import ChatbotLauncher from '../components/ChatbotLauncher'
import ApplicationChatbot from '../components/ApplicationChatbot'

const MyApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const data = await getApplications()
        setApplications(data)
      } catch (error) {
        console.error('Failed to load applications:', error)
      } finally {
        setLoading(false)
      }
    }
    loadApplications()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'success'
      case 'rejected':
        return 'error'
      case 'under review':
        return 'info'
      case 'pending':
        return 'warning'
      default:
        return 'default'
    }
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading applications...</Typography>
      </Container>
    )
  }

  return (
    <Box className="nature-bg" sx={{ minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box>
            <Typography variant="h1" className="fade-in">
              My Applications 🌱
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
              Track your planning applications and their environmental impact
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            className="eco-button"
            sx={{ 
              px: 3,
              py: 1.5,
              fontSize: '1rem',
            }}
          >
            New Application
          </Button>
        </Box>

        <Paper className="nature-card" sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            🏡 Application Summary
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={6} sm={3}>
              <Box className="grow-in" sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h3" color="primary.main" sx={{ fontWeight: 700 }}>
                  {applications.length}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Total Applications
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box className="grow-in" sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h3" color="success.main" sx={{ fontWeight: 700 }}>
                  {applications.filter(app => app.status.toLowerCase() === 'approved').length}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                  🌱 Approved
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box className="grow-in" sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h3" color="info.main" sx={{ fontWeight: 700 }}>
                  {applications.filter(app => app.status.toLowerCase().includes('review')).length}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                  🌿 Under Review
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box className="grow-in" sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h3" color="warning.main" sx={{ fontWeight: 700 }}>
                  {applications.filter(app => app.status.toLowerCase() === 'pending').length}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                  🌾 Pending
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">Recent Applications</Typography>
          <Button
            component={Link}
            to="/upload"
            variant="outlined"
            startIcon={<CloudUpload />}
          >
            Upload Documents
          </Button>
        </Box>

        <Grid container spacing={3}>
        {applications.map((application) => (
          <Grid item xs={12} key={application.id}>
            <Card sx={{ transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 4 } }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {application.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Reference: {application.referenceNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Submitted: {new Date(application.submissionDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Chip
                    label={application.status}
                    color={getStatusColor(application.status) as any}
                    variant="filled"
                  />
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {application.description}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Location: {application.address}
                  </Typography>
                  <Button
                    component={Link}
                    to={`/application/${application.id}`}
                    variant="contained"
                    startIcon={<Visibility />}
                    size="small"
                  >
                    View Details
                  </Button>
                </Box>

                {/* Check My Application Button - only show for application 10001 */}
                {application.referenceNumber === 'PP-2025-010001' && (
                  <ApplicationChatbot applicationRef={application.referenceNumber} />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
        </Grid>

        {applications.length === 0 && (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No Applications Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            You haven't submitted any planning applications yet.
          </Typography>
          <Button variant="contained" startIcon={<Add />}>
            Submit Your First Application
          </Button>
        </Paper>
        )}

        <ChatbotLauncher />
      </Container>
    </Box>
  )
}

export default MyApplications
