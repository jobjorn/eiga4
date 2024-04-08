'use client';
import React, { useState } from 'react';
import {
  AppBar,
  Avatar,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { Box, Stack } from '@mui/system';
import { Settings, ViewList } from '@mui/icons-material';
import { colors } from 'app/uicomponents/colors';

export const Footer: React.FC<{}> = () => {
  const { user } = useUser();

  return (
    <footer
      style={{
        backgroundColor: colors.mountain.main,
        width: '100%',
        padding: '25px',
        color: colors.mountain.contrast,
        fontSize: '0.8em'
      }}
    >
      <Container maxWidth="sm" style={{ display: 'flex' }}>
        <Box sx={{ flexGrow: 1 }}>
          <ul style={{ listStyle: 'none' }}>
            {user ? (
              <>
                <li>
                  1. <Link href="/overview">Partner</Link>
                </li>

                <li>
                  2. <Link href="/names">Namn</Link>
                </li>

                <li>
                  3. <Link href="/voting">Rösta</Link>
                </li>

                <li>
                  4. <Link href="/results">Resultat</Link>
                </li>
              </>
            ) : (
              <li>
                <Link href="/api/auth/login">Logga in</Link>
              </li>
            )}
          </ul>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <ul style={{ listStyle: 'none' }}>
            {user && (
              <>
                <li>
                  <Link href="/settings">Inställningar</Link>
                </li>
                <li>
                  <Link href="/api/auth/logout">Logga ut</Link>
                </li>
              </>
            )}
            <li>
              <Link href="/about">Om</Link>
            </li>
            <li>
              <Link href="/policy">Integritets- och cookiepolicy</Link>
            </li>
          </ul>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          Ett projekt av
          <br />
          <Link href="https://www.mejstedt.se">Hedvig</Link> och{' '}
          <Link href="https://www.jobjorn.se/">Jobjörn</Link> 🔥
        </Box>
      </Container>
    </footer>
  );
};
