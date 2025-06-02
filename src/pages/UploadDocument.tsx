import React, { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Alert,
  Snackbar,
  Grid,
  Card,
  CardContent,
} from '@mui/material'
import { 
  CloudUpload, 
  LocalFlorist, 
  DescriptionOutlined,
  CheckCircleOutline 
} from '@mui/icons-material'
    import DocumentUploader from '../components/DocumentUploader'
import { Document } from '../services/applicationService'

const UploadDocument: React.FC = () => {
  const [showUploader, setShowUploader] = useState(false)
  const [uploadedDocs, setUploadedDocs] = useState<Document[]>([])
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const handleUpload = (document: Document) => {
    setUploadedDocs(prev => [...prev, document])
    setSnackbarMessage(`Successfully uploaded ${document.name}`)
    setSnackbarOpen(true)
  }

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false)
  }

  const uploadGuidelines = [
    {
      icon: <DescriptionOutlined />,
      title: 'Accepted Formats',
      description: 'PDF, DOCX, JPG, PNG files up to 10MB each'
    },
    {
      icon: <LocalFlorist />,
      title: 'Eco-Friendly Tips',
      description: 'Digital documents reduce paper waste - thank you for being green!'
    },
    {
      icon: <CheckCircleOutline />,
      title: 'Quick Processing',
      description: 'Uploaded documents are processed immediately for faster review'
    }
  ]

  return (
    <Box className="nature-background" sx={{ minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <LocalFlorist sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
            <Typography variant="h1" className="nature-text eco-title" sx={{ 
              background: 'linear-gradient(135deg, #1B5E20 0%, #4CAF50 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>
              Upload Green Documents
            </Typography>
            <CloudUpload sx={{ fontSize: 40, color: 'success.main', ml: 2 }} />
          </Box>
          <Typography variant="body1" sx={{ 
            mb: 4, 
            maxWidth: '700px', 
            mx: 'auto',
            color: 'success.dark',
            fontSize: '1.1rem'
          }}>
            Upload supporting documents for your eco-friendly planning applications. 
            Going digital helps our environment - every uploaded document saves paper! 🌱
          </Typography>
        </Box>

        {/* Upload Guidelines */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {uploadGuidelines.map((guideline, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                className="nature-card"
                sx={{
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(139, 195, 74, 0.05) 100%)',
                  border: '2px solid rgba(76, 175, 80, 0.1)',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(76, 175, 80, 0.15)',
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{
                    color: 'success.main',
                    mb: 2,
                    display: 'flex',
                    justifyContent: 'center'
                  }}>
                    {React.cloneElement(guideline.icon, { fontSize: 'large' })}
                  </Box>
                  <Typography variant="h6" sx={{ color: 'success.dark', mb: 1, fontWeight: 600 }}>
                    {guideline.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {guideline.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Main Upload Section */}
        <Paper 
          className="nature-card"
          sx={{ 
            p: 6, 
            textAlign: 'center', 
            mb: 4,
            background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(139, 195, 74, 0.1) 100%)',
            border: '2px solid rgba(76, 175, 80, 0.2)',
            borderRadius: 4,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #4CAF50, #8BC34A, #CDDC39)',
            }
          }}
        >
          <CloudUpload sx={{ 
            fontSize: 80, 
            color: 'success.main', 
            mb: 3,
            filter: 'drop-shadow(0 4px 8px rgba(76, 175, 80, 0.2))'
          }} />
          <Typography variant="h4" sx={{ 
            mb: 2, 
            color: 'success.dark',
            fontWeight: 600 
          }}>
            🌿 Upload Your Green Documents
          </Typography>
          <Typography variant="body1" sx={{ 
            mb: 4, 
            color: 'text.secondary',
            maxWidth: '500px',
            mx: 'auto',
            lineHeight: 1.6
          }}>
            Click the button below to start uploading your eco-friendly documents. 
            Every digital document helps save our planet! 🌍
          </Typography>
          <Button
            className="eco-button"
            variant="contained"
            size="large"
            startIcon={<CloudUpload />}
            onClick={() => setShowUploader(true)}
            sx={{
              background: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
              color: 'white',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 3,
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(135deg, #388E3C 0%, #689F38 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(76, 175, 80, 0.3)',
              },
            }}
          >
            Select Green Files to Upload
          </Button>
        </Paper>

        {uploadedDocs.length > 0 && (
          <Paper 
            className="nature-card"
            sx={{ 
              p: 4,
              background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(139, 195, 74, 0.05) 100%)',
              border: '2px solid rgba(76, 175, 80, 0.1)',
              borderRadius: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <CheckCircleOutline sx={{ color: 'success.main', mr: 2 }} />
              <Typography variant="h6" sx={{ color: 'success.dark', fontWeight: 600 }}>
                🎉 Recently Uploaded Green Documents
              </Typography>
            </Box>
            {uploadedDocs.map((doc, index) => (
              <Alert
                key={index}
                severity="success"
                sx={{ 
                  mb: 2,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(139, 195, 74, 0.1) 100%)',
                  border: '1px solid rgba(76, 175, 80, 0.2)',
                  '&:last-child': {
                    mb: 0
                  }
                }}
                icon={<LocalFlorist />}
              >
                <Typography variant="body1">
                  🌱 Successfully uploaded: <strong>{doc.name}</strong>
                </Typography>
              </Alert>
            ))}
          </Paper>
        )}

        {showUploader && (
          <DocumentUploader
            onClose={() => setShowUploader(false)}
            onUpload={handleUpload}
          />
        )}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
        />
      </Container>
    </Box>
  )
}

export default UploadDocument
