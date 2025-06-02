import { createTheme } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Palette {
    nature: {
      forest: string;
      meadow: string;
      earth: string;
      sky: string;
      leaf: string;
    };
  }

  interface PaletteOptions {
    nature?: {
      forest?: string;
      meadow?: string;
      earth?: string;
      sky?: string;
      leaf?: string;
    };
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#ffffff',
      light: '#ffffff',
      dark: '#ffffff',
    },
    secondary: {
      main: '#ffffff',
      light: '#ffffff',
      dark: '#ffffff',
    },
    background: {
      default: '#ffffff', // Clean white background
      paper: '#ffffff',
    },
    text: {
      primary: '#1B5E20',
      secondary: '#388E3C',
    },
    nature: {
      forest: '#ffffff',
      meadow: '#ffffff',
      earth: '#795548',
      sky: '#E3F2FD',
      leaf: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Open Sans", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      color: '#1B5E20',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 600,
      color: '#1B5E20',
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.875rem',
      fontWeight: 600,
      color: '#2E7D32',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: '#2E7D32',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: '#388E3C',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      color: '#388E3C',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#2E7D32',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#388E3C',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(46, 125, 50, 0.15)',
          border: '1px solid #C8E6C9',
          borderRadius: 0,
          background: '#ffffff',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(46, 125, 50, 0.25)',
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease-in-out',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 600,
          padding: '12px 24px',
          fontSize: '1rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          background: '#ffffff',
          color: '#ffffff',
          '&:hover': {
            background: '#ffffff',
            color: '#ffffff',
          },
        },
        outlined: {
          borderColor: '#4CAF50',
          color: '#2E7D32',
          borderWidth: 2,
          '&:hover': {
            borderColor: '#2E7D32',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(46, 125, 50, 0.1)',
          borderRadius: 0,
          background: '#ffffff',
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(46, 125, 50, 0.1)',
        },
        elevation2: {
          boxShadow: '0 4px 16px rgba(46, 125, 50, 0.15)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 500,
        },
        colorPrimary: {
          background: '#ffffff',
          color: '#ffffff',
          '& .MuiChip-label': {
            color: '#ffffff',
          },
        },
        colorSecondary: {
          background: '#ffffff',
          color: '#1B5E20',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#ffffff',
          boxShadow: '0 2px 10px rgba(27, 94, 32, 0.3)',
          borderRadius: '0 !important',
        },
      },
    },
  },
})

export default theme
