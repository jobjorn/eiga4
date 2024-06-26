'use client';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Settings, ViewList } from '@mui/icons-material';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Avatar,
  Button,
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


import { Stack } from '@mui/system';
import Link from 'next/link';
import React, { useState } from 'react';

export const Menu: React.FC<{}> = () => {
  const [drawer, setDrawer] = useState(false);

  const theme = useTheme();

  const foldMenu = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar position="relative" sx={{ marginBottom: 2, boxShadow: 'none' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/" style={{ textDecoration: 'none' }} passHref>
            Namnväljaren
          </Link>
        </Typography>
        {foldMenu ? (
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <ToolbarList />
        )}
      </Toolbar>
      {foldMenu && (
        <Drawer anchor="right" open={drawer} onClose={() => setDrawer(false)}>
          <DrawerList />
        </Drawer>
      )}
    </AppBar>
  );
};

const ToolbarList: React.FC<{}> = () => {
  const { user } = useUser();

  return (
    <>
      {user ? (
        <Stack direction="row" spacing={1}>
          <Link href="/overview" passHref>
            <Button key={'Översikt'} sx={{ color: 'black' }}>
              Översikt
            </Button>
          </Link>

          <Link href="/names" passHref>
            <Button key={'Namn'} sx={{ color: 'black' }}>
              Namn
            </Button>
          </Link>

          <Link href="/voting" passHref>
            <Button key={'Rösta'} sx={{ color: 'black' }}>
              Rösta
            </Button>
          </Link>

          <Link href="/settings" passHref>
            <Button key={'Inställningar'} sx={{ color: 'black' }}>
              <Settings />
            </Button>
          </Link>
          <Divider orientation="vertical" sx={{ height: 'auto' }} />
          <Link href="/api/auth/logout" passHref>
            <Button key={'Logga ut'} sx={{ color: 'black' }}>
              Logga ut
            </Button>
          </Link>
        </Stack>
      ) : (
        <Link href="/api/auth/login" passHref>
          <Button key={'Logga in'} sx={{ color: 'black' }}>
            Logga in
          </Button>
        </Link>
      )}
    </>
  );
};

const DrawerList: React.FC<{}> = () => {
  const { user } = useUser();

  return (
    <List>
      {user && user.email ? (
        <>
          <ListItem>
            <ListItemAvatar>
              {user.picture && <Avatar src={user.picture} />}
            </ListItemAvatar>
            {user.name}
          </ListItem>

          <Divider />

          <Link href="/overview" passHref>
            <ListItemButton key={'Översikt'}>
              <ListItemIcon>
                <ViewList />
              </ListItemIcon>
              <ListItemText primary={'Översikt'} />
            </ListItemButton>
          </Link>

          <Link href="/names" passHref>
            <ListItemButton key={'Namn'}>
              <ListItemIcon>
                <ViewList />
              </ListItemIcon>
              <ListItemText primary={'Namn'} />
            </ListItemButton>
          </Link>

          <Link href="/voting" passHref>
            <ListItemButton key={'Rösta'}>
              <ListItemIcon>
                <ViewList />
              </ListItemIcon>
              <ListItemText primary={'Rösta'} />
            </ListItemButton>
          </Link>

          <Link href="/settings" passHref>
            <ListItemButton key={'Inställningar'}>
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText primary={'Inställningar'} />
            </ListItemButton>
          </Link>

          <Divider />

          <Link href="/api/auth/logout" passHref>
            <ListItemButton key={'Logga ut'}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary={'Logga ut'} />
            </ListItemButton>
          </Link>
        </>
      ) : (
        <Link href="/api/auth/login" passHref>
          <ListItemButton key={'Logga in'}>
            <ListItemIcon>
              <LoginIcon />
            </ListItemIcon>
            <ListItemText primary={'Logga in'} />
          </ListItemButton>
        </Link>
      )}
    </List>
  );
};
