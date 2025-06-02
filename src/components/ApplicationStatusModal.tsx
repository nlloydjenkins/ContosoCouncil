import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  CircularProgress,
  Paper,
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
} from '@mui/material';
import { 
  Close, 
  Refresh, 
  AccountCircle, 
  CheckCircle, 
  Error as ErrorIcon, 
  Warning, 
  Description, 
  LocationOn, 
  Home, 
  Architecture, 
  Engineering,
  Nature,
  Water,
  AccountBalance,
  Assignment,
  Info
} from '@mui/icons-material';
import { DirectLineService } from '../services/directLineService';
import { AuthService } from '../services/authService';

interface ApplicationStatusModalProps {
  open: boolean;
  onClose: () => void;
  applicationRef?: string;
}

const ApplicationStatusModal: React.FC<ApplicationStatusModalProps> = ({
  open,
  onClose,
  applicationRef = '10001'
}) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasPermissionRequest, setHasPermissionRequest] = useState(false);
  const [suggestedActions, setSuggestedActions] = useState<any[]>([]);
  const [tabValue, setTabValue] = useState(0);

  // Interface for document status
  interface DocumentItem {
    name: string;
    status: 'complete' | 'missing' | 'partial';
    icon: React.ReactNode;
    details?: string[];
    missingFields?: string[];
  }

  // Parse the bot response to extract structured data
  const parseApplicationData = (responseText: string) => {
    const documents: DocumentItem[] = [
      {
        name: 'Application Form',
        status: responseText.includes('Planning Application Form') ? 'complete' : 'missing',
        icon: <Assignment />,
        details: responseText.includes('John Smith') ? [
          'Applicant: John Smith',
          'Site: 12 Garden Lane, Anytown, AT1 2CD',
          'Description: Single-storey rear extension',
          'Certificate A - Sole owner'
        ] : undefined
      },
      {
        name: 'Location Plan',
        status: responseText.includes('Location Plan') ? 'complete' : 'missing',
        icon: <LocationOn />,
        details: responseText.includes('Map Scale: 1:1250') ? [
          'Scale: 1:1250',
          'North Arrow: Present',
          'Site outlined in red',
          'Includes surrounding roads'
        ] : undefined
      },
      {
        name: 'Block/Site Plan',
        status: responseText.includes('Block Plan') ? 'complete' : 'missing',
        icon: <Architecture />,
        details: responseText.includes('Map Scale: 1:200') ? [
          'Scale: 1:200',
          'Extension: 4m x 6m highlighted',
          'North Arrow: Present'
        ] : undefined
      },
      {
        name: 'Elevations',
        status: responseText.includes('Elevations') ? 'complete' : 'missing',
        icon: <Home />,
        details: responseText.includes('Scale: 1:100') && responseText.includes('Height') ? [
          'Scale: 1:100',
          'Height: 3.2m',
          'Materials: Brick to match existing',
          'Front, Rear, and Side elevations'
        ] : undefined
      },
      {
        name: 'Floor Plans',
        status: responseText.includes('Floor Plans') ? 'complete' : 'missing',
        icon: <Engineering />,
        details: responseText.includes('Existing Layout') ? [
          'Scale: 1:100',
          'Existing: Kitchen, Living Room, Bathroom',
          'Proposed: Added Dining Area to Rear'
        ] : undefined
      },
      {
        name: 'Ownership Certificate',
        status: responseText.includes('Ownership Certificate') ? 'complete' : 'missing',
        icon: <AccountBalance />,
        details: responseText.includes('Certificate A') ? [
          'Certificate A: Sole owner',
          'Signed: John Smith',
          'Date: 30/05/2025'
        ] : undefined
      },
      {
        name: 'Agricultural Holdings Certificate',
        status: responseText.includes('Agricultural Holdings Certificate') ? 'complete' : 'missing',
        icon: <Nature />,
        details: responseText.includes('not part of an agricultural holding') ? [
          'Not part of agricultural holding',
          'Signed: John Smith',
          'Date: 30/05/2025'
        ] : undefined
      },
      {
        name: 'CIL Form 1',
        status: responseText.includes('CIL Form 1') ? 'complete' : 'missing',
        icon: <Description />,
        details: responseText.includes('Planning Application No: 10001') ? [
          'Application No: 10001',
          'Existing Floor Area: 100 sqm',
          'Proposed Floor Area: 120 sqm',
          'Development Type: Domestic Extension'
        ] : undefined
      },
      {
        name: 'Design and Access Statement',
        status: responseText.includes('Design and Access Statement') && !responseText.includes('Missing') ? 'complete' : 'missing',
        icon: <Info />,
        missingFields: ['Design Rationale', 'Materials and Appearance', 'Accessibility (if relevant)']
      },
      {
        name: 'Planning Statement',
        status: responseText.includes('Planning Statement') && !responseText.includes('Missing') ? 'complete' : 'missing',
        icon: <Description />,
        missingFields: ['Summary of Proposed Works', 'Compliance with Local Policies']
      },
      {
        name: 'Flood Risk Assessment',
        status: responseText.includes('Flood Risk Assessment') && !responseText.includes('Missing') ? 'complete' : 'missing',
        icon: <Water />,
        missingFields: ['Flood Zone Identification', 'Mitigation Measures', 'Surface Water Drainage Plan']
      },
      {
        name: 'Heritage Statement',
        status: responseText.includes('Heritage Statement') && !responseText.includes('Missing') ? 'complete' : 'missing',
        icon: <AccountBalance />,
        missingFields: ['Description of Heritage Asset', 'Impact of Proposal', 'Justification for Works']
      },
      {
        name: 'Tree Survey/Arboricultural Report',
        status: responseText.includes('Tree Survey') && !responseText.includes('Missing') ? 'complete' : 'missing',
        icon: <Nature />,
        missingFields: ['Tree Locations and Species', 'Root Protection Areas', 'Impact of Proposed Work']
      },
      {
        name: 'Biodiversity/Ecology Report',
        status: responseText.includes('Biodiversity') && !responseText.includes('Missing') ? 'complete' : 'missing',
        icon: <Nature />,
        missingFields: ['Habitat Impact', 'Protected Species', 'Mitigation Plans']
      }
    ];

    return documents;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return '#4CAF50';
      case 'partial': return '#FF9800';
      case 'missing': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle sx={{ color: '#4CAF50' }} />;
      case 'partial': return <Warning sx={{ color: '#FF9800' }} />;
      case 'missing': return <ErrorIcon sx={{ color: '#F44336' }} />;
      default: return <Info sx={{ color: '#9E9E9E' }} />;
    }
  };const checkApplication = async () => {
    setLoading(true);
    setError(null);
    setResponse([]);
    setHasStarted(true);    try {
      const prompt = `check planning application ${applicationRef}`;
      console.log('Modal: Starting DirectLine request with popup auth, prompt:', prompt);
        // Use Bot Framework compatible authentication method
      console.log('Modal: Using Bot Framework authentication method...');
      const botResponse = await DirectLineService.sendMessageDetailed(prompt);
      
      console.log('Modal: Received bot response:', botResponse);
        if (botResponse.messages.length > 0) {
        setResponse(botResponse.messages);
        setHasPermissionRequest(botResponse.hasPermissionRequest);
        setSuggestedActions(botResponse.suggestedActions);
        
        // If we got a message but it's about permissions, show it as a warning rather than success
        if (botResponse.hasPermissionRequest) {
          setError(botResponse.messages.join('\n'));
        }
      } else {
        console.log('Modal: No text responses found, bot may have responded with rich content');
        setError('The planning assistant responded, but the response format is not supported in this view. Please try using the full chat interface below.');
      }
    } catch (err) {
      console.error('Modal: Error checking application:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      if (errorMessage.toLowerCase().includes('login') || errorMessage.toLowerCase().includes('auth')) {
        setError(`Authentication required: ${errorMessage}. Please try the login button below or contact support.`);
      } else {
        setError(`Failed to check application status: ${errorMessage}. Please try again later.`);
      }
    } finally {
      setLoading(false);
    }  };

  const handleManualLogin = async () => {
    try {
      const authService = AuthService.getInstance();
      await authService.loginWithPopup();
      // After successful login, retry the application check
      await checkApplication();
    } catch (error) {
      console.error('Manual login failed:', error);
      setError('Login failed. Please try again or contact support.');
    }
  };

  // Start the check when modal opens
  React.useEffect(() => {
    if (open && !hasStarted) {
      checkApplication();
    }
  }, [open]);  // Reset state when modal closes
  React.useEffect(() => {
    if (!open) {
      setLoading(false);
      setResponse([]);
      setError(null);
      setHasStarted(false);
      setHasPermissionRequest(false);
      setSuggestedActions([]);
      setTabValue(0);
    }
  }, [open]);const handleConnect = async () => {
    // Open the specific Copilot Studio connections page
    const connectionsUrl = 'https://copilotstudio.microsoft.com/c2/tenants/de6b5354-c00a-4c06-888c-81936c42d6f2/environments/Default-de6b5354-c00a-4c06-888c-81936c42d6f2/bots/cr41e_planCheckr/channels/pva-studio/conversations/a81799fb-94f2-4aad-aba6-55fd903fecb8/user-connections';
    window.open(connectionsUrl, '_blank');
    
    // Show helpful guidance
    setError('Opening Copilot Studio connections page...\n\nIf connections are already set up, please click "Retry" below to test the bot again.\n\nIf you see connection issues, review and reconnect any expired or failed connections, then return here and click "Retry".');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}      PaperProps={{
        sx: {
          width: '90vw',
          height: '85vh',
          maxWidth: '1400px',
          minHeight: '600px',
          borderRadius: '12px',
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: '#4CAF50',
          color: 'white',
          py: 2,
          px: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Box>
          <Typography variant="h6" component="div">
            🏡 Application Status Check
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
            Reference: {applicationRef}
          </Typography>
        </Box>
        <IconButton 
          onClick={onClose} 
          sx={{ 
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
            }
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          p: 3,
          gap: 2
        }}>
          {loading && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              p: 3,
              backgroundColor: '#f5f5f5',
              borderRadius: '8px'
            }}>
              <CircularProgress size={24} sx={{ color: '#4CAF50' }} />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Checking your application status...
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  🔍 Connecting to Contoso Council planning system<br/>
                  📋 Retrieving latest updates for application {applicationRef}<br/>
                  ⏳ This may take a few moments, please wait...
                </Typography>
              </Box>
            </Box>
          )}          {error && (
            <Alert 
              severity={hasPermissionRequest ? "warning" : "error"}
              sx={{ 
                borderRadius: '8px',
                '& .MuiAlert-message': {
                  width: '100%'
                }
              }}              
              action={
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>                  {hasPermissionRequest && (
                    <Button
                      color="inherit"
                      size="small"
                      onClick={handleConnect}
                      disabled={loading}
                      sx={{ 
                        backgroundColor: '#1976d2',
                        color: 'white',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: '#1565c0'
                        },
                        '&:disabled': {
                          backgroundColor: 'rgba(25, 118, 210, 0.3)',
                          color: 'rgba(255, 255, 255, 0.5)'
                        }
                      }}
                    >
                      🔗 Connect to Planning System
                    </Button>
                  )}
                  <Button
                    color="inherit"
                    size="small"
                    startIcon={<AccountCircle />}
                    onClick={handleManualLogin}
                    disabled={loading}
                  >
                    Login
                  </Button>
                  <Button
                    color="inherit"
                    size="small"
                    startIcon={<Refresh />}
                    onClick={checkApplication}
                    disabled={loading}
                  >
                    Retry
                  </Button>
                </Box>
              }
            >              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {hasPermissionRequest ? '🔗 Planning System Connection Required' : 'Unable to retrieve application status'}
              </Typography>              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {hasPermissionRequest ? 
                  'The planning assistant is working but cannot access the planning system data. This usually means connections need to be refreshed or re-authenticated.' :
                  error
                }
              </Typography>{hasPermissionRequest && (
                <Box sx={{ mt: 2, p: 2, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    📋 Setup Instructions:
                  </Typography>
                  <Typography variant="body2" component="div" sx={{ fontSize: '0.875rem' }}>
                    1. Click <strong>"🔗 Connect to Planning System"</strong> below<br/>
                    2. Check that <strong>GetRequirementsDocument</strong> and <strong>GetApplicationDetails</strong> show as "Connected"<br/>
                    3. If any connections show "Expired" or "Not Connected", click <strong>"Manage"</strong> to reconnect<br/>
                    4. Return here and click <strong>"Retry"</strong> to test the connection
                  </Typography>
                </Box>
              )}
            </Alert>
          )}          {response.length > 0 && (
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h6" sx={{ 
                color: '#2E7D32',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                📋 Application {applicationRef} - Detailed Status
              </Typography>
              
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                  <Tab label="📊 Overview" />
                  <Tab label="📄 Documents" />
                  <Tab label="❌ Missing Items" />
                </Tabs>
              </Box>

              {/* Overview Tab */}
              {tabValue === 0 && (
                <Box sx={{ flex: 1, overflow: 'auto' }}>
                  <Grid container spacing={3}>
                    {/* Application Summary Card */}
                    <Grid item xs={12} md={6}>
                      <Card sx={{ height: '100%', border: '1px solid #e0e0e0' }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Home color="primary" />
                            Application Summary
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Reference:</Typography>
                              <Typography variant="body2" fontWeight="600">{applicationRef}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Applicant:</Typography>
                              <Typography variant="body2" fontWeight="600">John Smith</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Site:</Typography>
                              <Typography variant="body2" fontWeight="600">12 Garden Lane</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Type:</Typography>
                              <Typography variant="body2" fontWeight="600">Single-storey extension</Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Status Summary Card */}
                    <Grid item xs={12} md={6}>
                      <Card sx={{ height: '100%', border: '1px solid #e0e0e0' }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Assignment color="primary" />
                            Document Status
                          </Typography>
                          {(() => {
                            const docs = parseApplicationData(response.join(' '));
                            const complete = docs.filter(d => d.status === 'complete').length;
                            const missing = docs.filter(d => d.status === 'missing').length;
                            const total = docs.length;
                            
                            return (
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Chip 
                                    icon={<CheckCircle />} 
                                    label={`${complete} Complete`} 
                                    color="success" 
                                    size="small" 
                                  />
                                  <Chip 
                                    icon={<ErrorIcon />} 
                                    label={`${missing} Missing`} 
                                    color="error" 
                                    size="small" 
                                  />
                                </Box>
                                <Box sx={{ 
                                  bgcolor: '#f5f5f5', 
                                  borderRadius: 1, 
                                  p: 2,
                                  textAlign: 'center'
                                }}>
                                  <Typography variant="h4" color="primary" fontWeight="bold">
                                    {Math.round((complete / total) * 100)}%
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Complete
                                  </Typography>
                                </Box>
                              </Box>
                            );
                          })()}
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Progress Chart */}
                    <Grid item xs={12}>
                      <Card sx={{ border: '1px solid #e0e0e0' }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ mb: 2 }}>Document Checklist</Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {parseApplicationData(response.join(' ')).map((doc, index) => (
                              <Chip
                                key={index}
                                icon={getStatusIcon(doc.status)}
                                label={doc.name}
                                sx={{
                                  bgcolor: doc.status === 'complete' ? '#e8f5e8' : 
                                           doc.status === 'missing' ? '#ffebee' : '#fff3e0',
                                  color: getStatusColor(doc.status),
                                  fontWeight: 500
                                }}
                              />
                            ))}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Documents Tab */}
              {tabValue === 1 && (
                <Box sx={{ flex: 1, overflow: 'auto' }}>
                  <TableContainer component={Paper} sx={{ border: '1px solid #e0e0e0' }}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                          <TableCell sx={{ fontWeight: 'bold' }}>Document</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Details</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {parseApplicationData(response.join(' ')).map((doc, index) => (
                          <TableRow key={index} sx={{ '&:nth-of-type(odd)': { bgcolor: '#fafafa' } }}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {doc.icon}
                                <Typography variant="body2" fontWeight="500">
                                  {doc.name}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                icon={getStatusIcon(doc.status)}
                                label={doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                                color={doc.status === 'complete' ? 'success' : 'error'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              {doc.details ? (
                                <List dense>
                                  {doc.details.map((detail, i) => (
                                    <ListItem key={i} sx={{ py: 0, px: 0 }}>
                                      <ListItemText 
                                        primary={detail} 
                                        primaryTypographyProps={{ variant: 'body2' }}
                                      />
                                    </ListItem>
                                  ))}
                                </List>
                              ) : (
                                <Typography variant="body2" color="text.secondary">
                                  No details available
                                </Typography>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* Missing Items Tab */}
              {tabValue === 2 && (
                <Box sx={{ flex: 1, overflow: 'auto' }}>
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="500">
                      ⚠️ The following documents and information are missing from your application
                    </Typography>
                  </Alert>
                  
                  <Grid container spacing={2}>
                    {parseApplicationData(response.join(' '))
                      .filter(doc => doc.status === 'missing')
                      .map((doc, index) => (
                        <Grid item xs={12} md={6} key={index}>
                          <Card sx={{ 
                            border: '2px solid #f44336', 
                            bgcolor: '#ffebee',
                            height: '100%'
                          }}>
                            <CardContent>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <ErrorIcon color="error" />
                                <Typography variant="h6" color="error" fontWeight="600">
                                  {doc.name}
                                </Typography>
                              </Box>
                              
                              {doc.missingFields && (
                                <>
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    Required elements:
                                  </Typography>
                                  <List dense>
                                    {doc.missingFields.map((field, i) => (
                                      <ListItem key={i} sx={{ py: 0, px: 0 }}>
                                        <ListItemIcon sx={{ minWidth: 24 }}>
                                          <ErrorIcon sx={{ fontSize: 16, color: '#f44336' }} />
                                        </ListItemIcon>
                                        <ListItemText 
                                          primary={field}
                                          primaryTypographyProps={{ variant: 'body2' }}
                                        />
                                      </ListItem>
                                    ))}
                                  </List>
                                </>
                              )}
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                  </Grid>
                  
                  {parseApplicationData(response.join(' ')).filter(doc => doc.status === 'missing').length === 0 && (
                    <Box sx={{ 
                      textAlign: 'center', 
                      py: 4,
                      color: 'text.secondary'
                    }}>
                      <CheckCircle sx={{ fontSize: 48, color: '#4CAF50', mb: 2 }} />
                      <Typography variant="h6" color="success.main">
                        All Required Documents Submitted!
                      </Typography>
                      <Typography variant="body2">
                        Your application appears to have all the necessary documentation.
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
              
              {/* Show suggested actions if available */}
              {suggestedActions.length > 0 && (
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Suggested actions:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {suggestedActions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          console.log('Suggested action clicked:', action);
                          // Handle suggested action - could trigger another bot message
                        }}
                      >
                        {action.title || action.value || `Action ${index + 1}`}
                      </Button>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}{!loading && !error && response.length === 0 && hasStarted && (
            <Box sx={{ 
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 2,
              color: 'text.secondary'
            }}>
              <Typography variant="body1">
                🤔 No text response received
              </Typography>
              <Typography variant="body2" sx={{ textAlign: 'center', mb: 2 }}>
                The planning assistant may have responded with rich content (cards, buttons, etc.) that requires the full chat interface.
              </Typography>
              <Typography variant="body2" sx={{ textAlign: 'center', fontWeight: 500 }}>
                💡 Try using the chat interface below for full functionality
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationStatusModal;
