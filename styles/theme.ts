'use client';

import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#67fc84',
      contrastText: '#000'
    },
    secondary: {
      main: '#9d8cff',
      contrastText: '#000'
    }
  },
  typography: {
    fontSize: 12
  }
});
