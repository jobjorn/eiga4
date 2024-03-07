'use client';

import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#e4c9e6',
      contrastText: '#000'
    },
    secondary: {
      main: '#d8f508',
      contrastText: '#000'
    }
  },
  typography: {
    fontSize: 12
  }
});
