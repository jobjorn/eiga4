'use client';

import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#F2BF64',
      contrastText: '#000'
    },
    secondary: {
      light: '#DAEDEA',
      main: '#78BDB2',
      contrastText: '#000'
    }
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 20
        }
      }
    }
  }
});
