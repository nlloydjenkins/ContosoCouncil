import React, { useState, useCallback } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
} from '@mui/material'
import { CloudUpload, AttachFile, Delete } from '@mui/icons-material'
import { uploadDocument, Document } from '../services/applicationService'

interface DocumentUploaderProps {
  applicationId?: string
  onClose: () => void
  onUpload: (document: Document) => void
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onClose,
  onUpload,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const validFiles = files.filter(file => {
      const isValidType = file.type === 'application/pdf' || 
                         file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB
      return isValidType && isValidSize
    })

    if (validFiles.length !== files.length) {
      setError('Some files were rejected. Only PDF and DOCX files under 10MB are allowed.')
    } else {
      setError(null)
    }

    setSelectedFiles(prev => [...prev, ...validFiles])
  }, [])

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const files = Array.from(event.dataTransfer.files)
    const validFiles = files.filter(file => {
      const isValidType = file.type === 'application/pdf' || 
                         file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB
      return isValidType && isValidSize
    })

    if (validFiles.length !== files.length) {
      setError('Some files were rejected. Only PDF and DOCX files under 10MB are allowed.')
    } else {
      setError(null)
    }

    setSelectedFiles(prev => [...prev, ...validFiles])
  }, [])

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }, [])

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return

    setUploading(true)
    setError(null)
    
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        setUploadProgress((i / selectedFiles.length) * 100)
        const document = await uploadDocument(file)
        onUpload(document)
      }
      setUploadProgress(100)
      onClose()
    } catch (err) {
      setError('Failed to upload documents. Please try again.')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Upload Documents</DialogTitle>
      <DialogContent>
        <Box
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          sx={{
            border: '2px dashed #ccc',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            bgcolor: '#fafafa',
            '&:hover': {
              bgcolor: '#f0f0f0',
            },
            mb: 3,
          }}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <CloudUpload sx={{ fontSize: 48, color: '#666', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Drag and drop files here or click to select
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Only PDF and DOCX files are accepted (max 10MB each)
          </Typography>
          <input
            id="file-input"
            type="file"
            multiple
            accept=".pdf,.docx"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {selectedFiles.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Selected Files ({selectedFiles.length})
            </Typography>
            <List dense>
              {selectedFiles.map((file, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => removeFile(index)}
                      disabled={uploading}
                    >
                      <Delete />
                    </IconButton>
                  }
                >
                  <ListItemIcon>
                    <AttachFile />
                  </ListItemIcon>
                  <ListItemText
                    primary={file.name}
                    secondary={formatFileSize(file.size)}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {uploading && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              Uploading... {Math.round(uploadProgress)}%
            </Typography>
            <LinearProgress variant="determinate" value={uploadProgress} />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={uploading}>
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={selectedFiles.length === 0 || uploading}
        >
          Upload {selectedFiles.length > 0 && `(${selectedFiles.length})`}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DocumentUploader
