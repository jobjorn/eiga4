import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from 'styles/theme';
import './global.scss';

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
      />
      <meta charSet="utf-8" />
      <UserProvider>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </UserProvider>
    </html>
  );
}
