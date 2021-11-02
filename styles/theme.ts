import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    mode: 'light'
  },
  typography: {
    fontSize: 16,
    h1: {
      fontSize: '2rem',
      fontWeight: 700
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 700,
      paddingTop: '2rem'
    },
    h3: {
      fontSize: '1.2rem',
      fontWeight: 700
    },
    h4: {
      fontSize: '1.15rem',
      fontWeight: 700
    },
    h5: {
      fontSize: '1.07rem',
      fontWeight: 700
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 700
    },
    body1: {
      fontSize: '1rem'
    },
    body2: {
      fontSize: '1rem'
    },
    button: {
      textTransform: 'none'
    }
  }
});
