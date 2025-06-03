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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Divider,
} from '@mui/material'
import {
  ArrowBack,
  CloudUpload,
  CheckCircle,
  Schedule,
  PendingActions,
  ExpandMore,
  Warning,
  Description,
  Info,
} from '@mui/icons-material'
import { getApplicationById, Application, Document as AppDocument } from '../services/applicationService'
import DocumentUploader from '../components/DocumentUploader'

// Define missing documents structure based on Copilot Studio output
interface MissingDocumentRequirement {
  title: string
  items: string[]
  guidance: string
}

interface MissingDocument {
  name: string
  requirements: MissingDocumentRequirement[]
}

const missingDocuments: MissingDocument[] = [
  {
    name: "Design and Access Statement",
    requirements: [
      {
        title: "Design Rationale",
        items: ["Detailed information about the design rationale"],
        guidance: "Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation."
      },
      {
        title: "Materials and Appearance", 
        items: ["Detailed information about materials and appearance"],
        guidance: "Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation."
      },
      {
        title: "Accessibility (if relevant)",
        items: ["Detailed information about accessibility"],
        guidance: "Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation."
      }
    ]
  },
  {
    name: "Planning Statement",
    requirements: [
      {
        title: "Summary of Proposed Works",
        items: ["Detailed information about the summary of proposed works"],
        guidance: "Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation."
      },
      {
        title: "Compliance with Local Policies",
        items: ["Detailed information about compliance with local policies"],
        guidance: "Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation."
      }
    ]
  },
  {
    name: "Flood Risk Assessment",
    requirements: [
      {
        title: "Flood Zone Identification",
        items: ["Detailed information about flood zone identification"],
        guidance: "Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation."
      },
      {
        title: "Mitigation Measures",
        items: ["Detailed information about mitigation measures"],
        guidance: "Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation."
      },
      {
        title: "Surface Water Drainage Plan",
        items: ["Detailed information about the surface water drainage plan"],
        guidance: "Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation."
      }
    ]
  },
  {
    name: "Heritage Statement",
    requirements: [
      {
        title: "Description of Heritage Asset",
        items: ["Detailed information about the description of the heritage asset"],
        guidance: "Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation."
      },
      {
        title: "Impact of Proposal",
        items: ["Detailed information about the impact of the proposal"],
        guidance: "Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation."
      },
      {
        title: "Justification for Works",
        items: ["Detailed information about the justification for works"],
        guidance: "Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation."
      }
    ]
  },
  {
    name: "Tree Survey or Arboricultural Report",
    requirements: [
      {
        title: "Tree Locations and Species",
        items: ["Detailed information about tree locations and species"],
        guidance: "Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation."
      },
      {
        title: "Root Protection Areas",
        items: ["Detailed information about root protection areas"],
        guidance: "Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation."
      },
      {
        title: "Impact of Proposed Work",
        items: ["Detailed information about the impact of proposed work"],
        guidance: "Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation."
      }
    ]
  },
  {
    name: "Biodiversity or Ecology Report",
    requirements: [
      {
        title: "Habitat Impact",
        items: ["Detailed information about habitat impact"],
        guidance: "Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation."
      },
      {
        title: "Protected Species",
        items: ["Detailed information about protected species"],
        guidance: "Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation."
      },
      {
        title: "Mitigation Plans",
        items: ["Detailed information about mitigation plans"],
        guidance: "Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation."
      }
    ]
  }
]

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
        </Box>        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {/* Missing Documents Alert */}
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  ⚠️ Missing Documents
                </Typography>
                <Typography variant="body1">
                  The planning application {application.referenceNumber} is missing the following documents:
                </Typography>
                <List dense sx={{ mt: 1 }}>
                  {missingDocuments.map((doc, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Warning color="warning" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={doc.name} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Alert>

            {/* Document Requirements */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                📋 Document Requirements & Guidance
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                To correct these errors, please refer to the following guidance:
              </Typography>
              
              {missingDocuments.map((doc, docIndex) => (
                <Box key={docIndex} sx={{ mb: 4 }}>
                  <Accordion defaultExpanded={docIndex === 0}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Description color="primary" />
                        <Typography variant="h6" color="primary">
                          {doc.name}
                        </Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      {doc.requirements.map((req, reqIndex) => (
                        <Box key={reqIndex} sx={{ mb: 3 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                            {req.title}
                          </Typography>
                          <List dense>
                            {req.items.map((item, itemIndex) => (
                              <ListItem key={itemIndex} sx={{ py: 0.5, pl: 0 }}>
                                <ListItemIcon sx={{ minWidth: 24 }}>
                                  <Info color="info" fontSize="small" />
                                </ListItemIcon>
                                <ListItemText 
                                  primary={item}
                                  primaryTypographyProps={{ variant: 'body2' }}
                                />
                              </ListItem>
                            ))}
                          </List>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, pl: 3 }}>
                            📌 {req.guidance}
                          </Typography>
                          {reqIndex < doc.requirements.length - 1 && <Divider sx={{ mt: 2 }} />}
                        </Box>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                </Box>
              ))}

              <Box sx={{ mt: 4, p: 3, bgcolor: 'info.light', borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom>
                  📄 Document Templates
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You can find the templates for these documents below:
                </Typography>
                <Button
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={() => setShowUploader(true)}
                >
                  Access Document Templates
                </Button>
              </Box>
            </Paper>

            {/* Application Details */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                📋 Application Details
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
                🔄 Application Progress
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
          </Grid>        <Grid item xs={12} md={4}>
          {/* Quick Actions */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              🚀 Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<CloudUpload />}
                onClick={() => setShowUploader(true)}
                fullWidth
                color="success"
              >
                Upload Missing Documents
              </Button>
              <Button
                variant="outlined"
                component={Link}
                to="/upload"
                fullWidth
                startIcon={<Description />}
              >
                Access Document Templates
              </Button>
            </Box>
          </Paper>

          {/* Application Summary */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              📊 Application Summary
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Reference Number
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {application.referenceNumber}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={`${getStatusIcon(application.status)} ${application.status}`}
                  color={getStatusColor(application.status) as any}
                  variant="filled"
                  size="small"
                />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Missing Documents
                </Typography>
                <Chip
                  label={`${missingDocuments.length} documents`}
                  color="warning"
                  variant="outlined"
                  size="small"
                  icon={<Warning />}
                />
              </Box>
            </Box>
          </Paper>

          {/* Submitted Documents */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              📁 Submitted Documents
            </Typography>
            {application.documents.length > 0 ? (
              <List dense>
                {application.documents.map((doc) => (
                  <ListItem key={doc.id} divider>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary={doc.name}
                      secondary={`Uploaded: ${new Date(doc.uploadDate).toLocaleDateString()}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Alert severity="info" variant="outlined">
                <Typography variant="body2">
                  No documents uploaded yet. Please upload the required documents to proceed with your application.
                </Typography>
              </Alert>
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
