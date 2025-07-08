import React, { useState } from 'react'
import { Fab, Dialog, DialogTitle, DialogContent, IconButton, Box } from '@mui/material'
import { Chat, Close } from '@mui/icons-material'

const ChatbotLauncher: React.FC = () => {
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000,
          bgcolor: '#0078D4',
          '&:hover': {
            bgcolor: '#106ebe',
          },
        }}
        onClick={handleOpen}
      >
        <Chat />
      </Fab>

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
            bgcolor: '#005A9C',
            color: 'white',
            py: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          Chat
          <IconButton onClick={handleClose} sx={{ color: 'white', p: 0.5 }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, height: '100%' }}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <iframe
              src="https://copilotstudio.microsoft.com/environments/Default-de6b5354-c00a-4c06-888c-81936c42d6f2/bots/cr41e_agent/webchat?__version__=2"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                borderRadius: '0 0 10px 10px',
              }}
              title="Contoso Council Chatbot"
            />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ChatbotLauncher
