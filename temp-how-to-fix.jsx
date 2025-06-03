              {/* How to Fix Tab */}
              {tabValue === 2 && (
                <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
                  {/* Main Title with Icon */}
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      mb: 4,
                      p: 2,
                      background: 'linear-gradient(145deg, #2196f3 0%, #1976d2 100%)',
                      borderRadius: 2,
                      boxShadow: '0 4px 20px rgba(33, 150, 243, 0.25)'
                    }}
                  >
                    <Info sx={{ mr: 2, color: 'white', fontSize: 32 }} />
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                      How to Fix Your Application
                    </Typography>
                  </Box>
                  
                  {(() => {
                    const rawOutput = response.join('\n');
                    const fixSections = parseHowToFixSection(rawOutput);
                    
                    if (fixSections.length > 0) {
                      return (
                        <Grid container spacing={3}>
                          {fixSections.map((section, index) => (
                            <Grid item xs={12} key={index}>
                              <Card 
                                sx={{ 
                                  mb: 3,
                                  borderRadius: 2,
                                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                  overflow: 'visible',
                                  position: 'relative',
                                  '&:hover': {
                                    boxShadow: '0 12px 28px rgba(0,0,0,0.2)',
                                    transform: 'translateY(-4px)',
                                    transition: 'all 0.3s ease'
                                  }
                                }}
                              >
                                {/* Document icon badge */}
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    top: -16,
                                    left: 20,
                                    width: 60,
                                    height: 60,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: '#3f51b5',
                                    boxShadow: '0 4px 14px rgba(63, 81, 181, 0.4)',
                                    zIndex: 1,
                                    border: '3px solid white'
                                  }}
                                >
                                  <Description sx={{ fontSize: 32, color: 'white' }} />
                                </Box>
                                
                                {/* Colored header with file name */}
                                <Box
                                  sx={{
                                    p: 2,
                                    pl: 9,
                                    background: 'linear-gradient(145deg, #3f51b5 0%, #303f9f 100%)',
                                    color: 'white',
                                    borderTopLeftRadius: 8,
                                    borderTopRightRadius: 8,
                                  }}
                                >
                                  <Typography 
                                    variant="h5" 
                                    sx={{ 
                                      fontWeight: 600,
                                      textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                                    }}
                                  >
                                    {section.title.includes('.txt') ? section.title : `${section.title}.txt`}
                                  </Typography>
                                </Box>
                                
                                <CardContent sx={{ p: 4, pt: 3 }}>
                                  <Typography variant="subtitle1" sx={{ mb: 3, color: '#555', fontWeight: 500 }}>
                                    Missing fields to complete:
                                  </Typography>
                                  
                                  {section.items.map((item, itemIndex) => (
                                    <Box 
                                      key={itemIndex} 
                                      sx={{ 
                                        mb: 2,
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        p: 2,
                                        borderRadius: 1,
                                        backgroundColor: itemIndex % 2 === 0 ? '#f5f8ff' : '#fff',
                                        border: '1px solid',
                                        borderColor: itemIndex % 2 === 0 ? '#e8eaf6' : '#eceff1',
                                      }}
                                    >
                                      <Box 
                                        sx={{ 
                                          minWidth: 36, 
                                          height: 36, 
                                          borderRadius: '50%', 
                                          backgroundColor: '#e3f2fd',
                                          display: 'flex',
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          mr: 2 
                                        }}
                                      >
                                        <Typography sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                                          {itemIndex + 1}
                                        </Typography>
                                      </Box>
                                      <Typography 
                                        variant="body1" 
                                        sx={{ 
                                          lineHeight: 1.6,
                                          color: 'text.primary',
                                          flex: 1,
                                          pt: 0.5
                                        }}
                                      >
                                        {item}
                                      </Typography>
                                    </Box>
                                  ))}
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      );
                    } else {
                      return (
                        <Card 
                          sx={{ 
                            borderRadius: 3,
                            backgroundColor: '#f5f9ff',
                            textAlign: 'center',
                            p: 5,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                          }}
                        >
                          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                            <Info sx={{ fontSize: 64, color: '#bbdefb' }} />
                          </Box>
                          <Typography 
                            variant="h5" 
                            sx={{ 
                              color: '#1976d2',
                              mb: 2,
                              fontWeight: 'bold'
                            }}
                          >
                            No specific guidance available
                          </Typography>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              color: 'text.secondary',
                              maxWidth: 600,
                              mx: 'auto'
                            }}
                          >
                            The system will provide detailed step-by-step guidance once your application has been analyzed.
                          </Typography>
                        </Card>
                      );
                    }
                  })()}
                </Box>
              )}
