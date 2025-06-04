import React, { useState } from 'react'
import { Button, Dialog, DialogTitle, DialogContent, IconButton, Box } from '@mui/material'
import { Chat, Close } from '@mui/icons-material'

interface ApplicationChatbotProps {
  applicationRef?: string
}

const ApplicationChatbot: React.FC<ApplicationChatbotProps> = ({ applicationRef }) => {
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<Chat />}
        onClick={handleOpen}
        sx={{ 
          mt: 2,
          borderColor: '#4CAF50',
          color: '#2E7D32',
          '&:hover': {
            borderColor: '#2E7D32',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
          },
        }}
      >
        Check My Application
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={false}
        PaperProps={{
          sx: {
            width: '400px',
            height: '600px',
            maxHeight: '80vh',
            borderRadius: '10px',
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: '#4CAF50',
            color: 'white',
            py: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          Planning Assistant
          <IconButton onClick={handleClose} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, height: '100%' }}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <iframe
              src={`https://web.powerva.microsoft.com/environments/Default-d86b20c3-c3ec-43b3-8500-84e235e3b94c/bots/cr94b_contosoCouncilChatbot/webchat?__version__=2&applicationRef=${applicationRef || '10001'}`}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
              title="Contoso Council Planning Assistant"
            />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ApplicationChatbot
