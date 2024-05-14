/* eslint-disable @next/next/no-page-custom-font */
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Box, Container, CssBaseline, ThemeProvider } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { Footer } from 'components/Footer';
import { theme } from 'styles/theme';
import './global.scss';

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@700&display=swap"
          rel="stylesheet"
        />
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
                  minHeight: '100svh',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Container
                  maxWidth="sm"
                  sx={{
                    flexGrow: 1,
                    marginTop: '2em',
                    marginBottom: '2em',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
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
