import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Container,
  Typography,
  Button,
  Box,
  Chip,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material'
import {
  ArrowBack,
  CloudUpload,
  AttachFile,
  CheckCircle,
  Schedule,
  PendingActions,
} from '@mui/icons-material'
import { getApplicationById, Application, Document as AppDocument } from '../services/applicationService'
import DocumentUploader from '../components/DocumentUploader'

const ApplicationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [showUploader, setShowUploader] = useState(false)

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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return '🌱'
      case 'rejected':
        return '🍂'
      case 'under review':
        return '🌿'
      case 'pending':
        return '🌾'
      default:
        return '📄'
    }
  }

  useEffect(() => {
    const loadApplication = async () => {
      if (id) {
        try {
          const data = await getApplicationById(id)
          setApplication(data)
        } catch (error) {
          console.error('Failed to load application:', error)
        } finally {
          setLoading(false)
        }
      }
    }
    loadApplication()
  }, [id])

  const getTimelineIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle color="success" />
      case 'current':
        return <Schedule color="info" />
      case 'pending':
        return <PendingActions color="disabled" />
      default:
        return <PendingActions color="disabled" />
    }
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading application details...</Typography>
      </Container>
    )
  }

  if (!application) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Application Not Found
        </Typography>
        <Button component={Link} to="/my-applications" startIcon={<ArrowBack />}>
          Back to Applications
        </Button>
      </Container>
    )
  }

  return (
    <Box className="nature-bg" sx={{ minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Button
            component={Link}
            to="/my-applications"
            startIcon={<ArrowBack />}
            className="eco-button"
            variant="outlined"
            sx={{ mb: 3 }}
          >
            Back to Applications
          </Button>
          
          <Paper className="nature-card" sx={{ p: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h3" gutterBottom className="fade-in">
                  🏡 {application.title}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  📋 Reference: {application.referenceNumber}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  📍 {application.address}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  📅 Submitted: {new Date(application.submissionDate).toLocaleDateString()}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip
                  label={`${getStatusIcon(application.status)} ${application.status}`}
                  color={getStatusColor(application.status) as any}
                  variant="filled"
                  sx={{ fontWeight: 600, fontSize: '1rem', py: 1, px: 2 }}
                />
                <Button
                  variant="contained"
                  startIcon={<CloudUpload />}
                  onClick={() => setShowUploader(true)}
                  className="eco-button"
                >
                  Upload Documents
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>

        <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {/* Application Details */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Application Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Submission Date
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {new Date(application.submissionDate).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Application Type
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {application.applicationType}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Address
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {application.address}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body1">
                  {application.description}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Progress Timeline */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Application Progress
            </Typography>
            <Stepper orientation="vertical">
              {application.timeline.map((event) => (
                <Step key={event.id} active={event.status === 'current'} completed={event.status === 'completed'}>
                  <StepLabel icon={getTimelineIcon(event.status)}>
                    <Typography variant="h6">{event.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(event.date).toLocaleDateString()}
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {event.description}
                    </Typography>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Actions */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<CloudUpload />}
                onClick={() => setShowUploader(true)}
                fullWidth
              >
                Upload Documents
              </Button>
              <Button
                variant="outlined"
                component={Link}
                to="/upload"
                fullWidth
              >
                Upload Additional Documents
              </Button>
            </Box>
          </Paper>

          {/* Documents */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Documents
            </Typography>
            {application.documents.length > 0 ? (
              <List dense>
                {application.documents.map((doc) => (
                  <ListItem key={doc.id} divider>
                    <ListItemIcon>
                      <AttachFile />
                    </ListItemIcon>
                    <ListItemText
                      primary={doc.name}
                      secondary={`Uploaded: ${new Date(doc.uploadDate).toLocaleDateString()}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No documents uploaded yet.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Document Uploader Modal */}
      {showUploader && application && (
        <DocumentUploader
          applicationId={application.id}
          onClose={() => setShowUploader(false)}
          onUpload={(doc: AppDocument) => {
            setApplication(prev => prev ? {
              ...prev,
              documents: [...prev.documents, doc]
            } : null)
          }}
        />
      )}
      </Container>
    </Box>
  )
}

export default ApplicationDetails
