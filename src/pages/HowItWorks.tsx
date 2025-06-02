import React from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import {
  ExpandMore,
  Assignment,
  Search,
  Gavel,
  CheckCircle,
  Download,
  QuestionAnswer,
  Grass,
  LocalFlorist,
  Park,
} from '@mui/icons-material'

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <Assignment fontSize="large" />,
      title: 'Submit Application',
      description: 'Complete and submit your eco-friendly planning application online with all required documents.',
      details: [
        'Fill out the application form completely',
        'Upload site plans and environmental impact drawings',
        'Pay the application fee',
        'Receive confirmation and reference number'
      ]
    },
    {
      icon: <Search fontSize="large" />,
      title: 'Environmental Review',
      description: 'Our team reviews your application for completeness, compliance, and environmental impact.',
      details: [
        'Application checked for completeness',
        'Documents verified for environmental accuracy',
        'Consultation period begins with community',
        'Neighbors notified for eco-considerations'
      ]
    },
    {
      icon: <Gavel fontSize="large" />,
      title: 'Sustainable Assessment',
      description: 'Planning officers assess your application against local planning policies and sustainability guidelines.',
      details: [
        'Technical assessment by eco-planning officers',
        'Site visit for environmental impact',
        'Consultation with environmental departments',
        'Review of community and environmental feedback'
      ]
    },
    {
      icon: <CheckCircle fontSize="large" />,
      title: 'Green Decision',
      description: 'Final decision is made with environmental considerations and you are notified of the outcome.',
      details: [
        'Decision made by planning committee with eco-focus',
        'Decision notice issued with environmental conditions',
        'Green building conditions attached if approved',
        'Right of appeal with environmental support'
      ]
    }
  ]

  const faqs = [
    {
      question: 'How long does the planning process take?',
      answer: 'Most householder applications are determined within 8 weeks of submission. Larger applications may take up to 13 weeks. We aim to make decisions as quickly as possible while ensuring thorough assessment.'
    },
    {
      question: 'What documents do I need to submit?',
      answer: 'You will typically need completed application forms, site location plan, existing and proposed floor plans, elevation drawings, and any supporting documents. The specific requirements depend on your application type.'
    },
    {
      question: 'How much does a planning application cost?',
      answer: 'Fees vary depending on the type of application. Householder applications typically cost £206, while larger developments have higher fees. Check our fee calculator for specific costs.'
    },
    {
      question: 'Can I track my application progress?',
      answer: 'Yes! You can track your application progress in real-time through this portal. You will receive email notifications at key stages and can view detailed status updates.'
    },
    {
      question: 'What happens if my application is refused?',
      answer: 'If your application is refused, you have the right to appeal to the Planning Inspectorate within 6 months. You can also submit a revised application addressing the reasons for refusal.'
    },
    {
      question: 'Do I need planning permission for my project?',
      answer: 'Not all building work requires planning permission. Many projects fall under permitted development rights. Use our chatbot or contact us for guidance on whether you need permission.'
    }
  ]

  const downloadableForms = [
    { name: 'Householder Application Form', type: 'PDF', size: '2.1 MB' },
    { name: 'Full Planning Application Form', type: 'PDF', size: '3.4 MB' },
    { name: 'Listed Building Consent Form', type: 'PDF', size: '1.8 MB' },
    { name: 'Planning Permission Guidance', type: 'PDF', size: '4.2 MB' },
  ]

  return (
    <Box className="nature-background" sx={{ minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
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
              How Eco-Planning Works
            </Typography>
            <Park sx={{ fontSize: 40, color: 'success.main', ml: 2 }} />
          </Box>
          <Typography variant="body1" sx={{ 
            mb: 4, 
            maxWidth: '800px', 
            mx: 'auto',
            color: 'success.dark',
            fontSize: '1.1rem'
          }}>
            Understanding our sustainable planning permission process helps ensure your 
            eco-friendly application runs smoothly. Follow our green step-by-step guide 
            to learn what to expect at each environmentally conscious stage.
          </Typography>
        </Box>

        {/* Process Steps */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h2" className="nature-text eco-title" sx={{ 
            mb: 3,
            color: 'success.dark',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
          }}>
            <Grass sx={{ fontSize: 32 }} />
            The Green Planning Process
            <Grass sx={{ fontSize: 32 }} />
          </Typography>
        </Box>
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {steps.map((step, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Paper
                className="nature-card"
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(139, 195, 74, 0.05) 100%)',
                  border: '2px solid rgba(76, 175, 80, 0.1)',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 32px rgba(76, 175, 80, 0.15)',
                    borderColor: 'success.main',
                  },
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
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box
                    sx={{
                      color: 'success.main',
                      mr: 3,
                      minWidth: 56,
                      height: 56,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(139, 195, 74, 0.1) 100%)',
                      border: '2px solid rgba(76, 175, 80, 0.2)',
                    }}
                  >
                    {step.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ 
                      color: 'success.dark',
                      fontWeight: 600,
                      mb: 0.5
                    }}>
                      Step {index + 1}: {step.title}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1" sx={{ 
                  mb: 3,
                  color: 'text.primary',
                  lineHeight: 1.6
                }}>
                  {step.description}
                </Typography>
                <List dense sx={{ mt: 'auto' }}>
                  {step.details.map((detail, detailIndex) => (
                    <ListItem key={detailIndex} sx={{ py: 0.5, px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <LocalFlorist fontSize="small" sx={{ color: 'success.main' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={detail}
                        primaryTypographyProps={{ 
                          variant: 'body2',
                          sx: { color: 'text.secondary' }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Downloadable Forms */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h2" className="nature-text eco-title" sx={{ 
            mb: 3,
            color: 'success.dark',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
          }}>
            <Download sx={{ fontSize: 32 }} />
            Eco-Friendly Forms & Resources
            <Download sx={{ fontSize: 32 }} />
          </Typography>
        </Box>
        <Paper className="nature-card" sx={{ 
          p: 4, 
          mb: 6,
          background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(139, 195, 74, 0.05) 100%)',
          border: '2px solid rgba(76, 175, 80, 0.1)',
          borderRadius: 3,
        }}>
          <Typography variant="body1" sx={{ mb: 3, color: 'success.dark', textAlign: 'center' }}>
            Download the eco-friendly forms you need for your sustainable planning application:
          </Typography>
          <Grid container spacing={3}>
            {downloadableForms.map((form, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box
                  className="eco-button"
                  sx={{
                    border: '2px solid rgba(76, 175, 80, 0.2)',
                    borderRadius: 3,
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(76, 175, 80, 0.05) 100%)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(76, 175, 80, 0.15)',
                      borderColor: 'success.main',
                    },
                  }}
                >
                  <Download sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                  <Typography variant="body2" fontWeight="medium" gutterBottom sx={{ color: 'success.dark' }}>
                    {form.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {form.type} • {form.size}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* FAQ Section */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h2" className="nature-text eco-title" sx={{ 
            mb: 3,
            color: 'success.dark',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
          }}>
            <QuestionAnswer sx={{ fontSize: 32 }} />
            Green Planning FAQs
            <QuestionAnswer sx={{ fontSize: 32 }} />
          </Typography>
        </Box>
        <Box sx={{ mb: 6 }}>
          {faqs.map((faq, index) => (
            <Accordion 
              key={index} 
              sx={{ 
                mb: 2,
                borderRadius: '12px !important',
                border: '1px solid rgba(76, 175, 80, 0.2)',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(76, 175, 80, 0.05) 100%)',
                '&:before': {
                  display: 'none',
                },
                '&.Mui-expanded': {
                  borderColor: 'success.main',
                  boxShadow: '0 4px 16px rgba(76, 175, 80, 0.1)',
                }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore sx={{ color: 'success.main' }} />}
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: '12px',
                  '&:hover': {
                    bgcolor: 'rgba(76, 175, 80, 0.05)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocalFlorist sx={{ mr: 3, color: 'success.main', fontSize: 24 }} />
                  <Typography variant="h6" sx={{ color: 'success.dark', fontWeight: 600 }}>
                    {faq.question}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pb: 3 }}>
                <Typography variant="body1" sx={{ 
                  color: 'text.primary',
                  lineHeight: 1.6,
                  ml: 5 
                }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {/* Call to Action */}
        <Paper
          className="nature-card"
          sx={{
            p: 5,
            textAlign: 'center',
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <Park sx={{ fontSize: 36, color: 'success.main', mr: 2 }} />
            <Typography variant="h5" sx={{ color: 'success.dark', fontWeight: 600 }}>
              Ready to Submit Your Eco-Application?
            </Typography>
            <Park sx={{ fontSize: 36, color: 'success.main', ml: 2 }} />
          </Box>
          <Typography variant="body1" sx={{ mb: 4, color: 'text.primary', maxWidth: '600px', mx: 'auto' }}>
            Start your sustainable planning application today or get help from our eco-conscious AI assistant.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              className="eco-button"
              variant="contained" 
              size="large"
              startIcon={<Grass />}
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
                },
              }}
            >
              Start Green Application
            </Button>
            <Button 
              className="eco-button"
              variant="outlined" 
              size="large"
              startIcon={<LocalFlorist />}
              sx={{
                borderColor: 'success.main',
                color: 'success.main',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 3,
                textTransform: 'none',
                borderWidth: '2px',
                '&:hover': {
                  borderWidth: '2px',
                  borderColor: 'success.dark',
                  bgcolor: 'rgba(76, 175, 80, 0.05)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Get Eco-Assistant Help
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default HowItWorks
