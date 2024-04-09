import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Box, Container, CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from 'styles/theme';
import './global.scss';
import { Footer } from 'components/Footer';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Namnväljaren 3.0'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
        <meta charSet="utf-8" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </head>
      <body>
        <UserProvider>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Box
                sx={{
                  flexGrow: 1,
                  minHeight: '100svh',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Container
                  maxWidth="sm"
                  sx={{ flexGrow: 1, marginTop: '2em', marginBottom: '2em' }}
                >
                  {children}
                </Container>
                <Footer />
              </Box>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </UserProvider>
      </body>
    </html>
  );
}
