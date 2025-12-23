import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1a237e',
      light: '#534bae',
      dark: '#000051',
    },
    secondary: {
      main: '#7c4dff',
      light: '#b47cff',
      dark: '#3f1dcb',
    },
    background: {
      default: '#0a0a0f',
      paper: '#0d1421',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0bec5',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '0.05em',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '0.03em',
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.1em',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          textTransform: 'uppercase',
          fontWeight: 600,
          padding: '12px 32px',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #1a237e 0%, #7c4dff 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #534bae 0%, #b47cff 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(13, 20, 33, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(124, 77, 255, 0.2)',
          borderRadius: '12px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(10, 10, 15, 0.85)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(124, 77, 255, 0.2)',
        },
      },
    },
  },
});

export default theme;
