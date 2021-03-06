import { useRouter } from 'next/router';
import React from 'react';
import Link from 'next/link';
import { Paper, styled } from '@mui/material';

interface MenuItemLiProps {
  isActive: boolean;
}

const MenuItemLi = styled('li', {
  shouldForwardProp: (prop) => prop !== 'isActive'
})<MenuItemLiProps>((props) => ({
  display: 'inline-block',
  padding: props.theme.spacing(2),
  backgroundColor: props.isActive
    ? props.theme.palette.primary.light
    : 'inherit'
}));

interface MenuItemProps {
  target: string;
}

const StyledA = styled('a')((props) => ({
  color: props.theme.palette.primary.contrastText,
  textDecoration: 'none'
}));

const MenuItem: React.FC<MenuItemProps> = (props) => {
  const router = useRouter();
  return (
    <MenuItemLi isActive={router.pathname === props.target}>
      <Link href={props.target} passHref>
        <StyledA>{props.children}</StyledA>
      </Link>
    </MenuItemLi>
  );
};

const MenuBar = styled('ul')((props) => ({
  color: props.theme.palette.primary.contrastText,
  backgroundColor: props.theme.palette.primary.dark,
  display: 'flexbox',
  flexDirection: 'column'
}));

export const Menu: React.FC<{}> = () => {
  const router = useRouter();
  return (
    <Paper>
      <MenuBar>
        <MenuItem target="/">Home</MenuItem>
        <MenuItem target="/list">List</MenuItem>
        <MenuItem target="/log">Log</MenuItem>
        <MenuItem target="/import">Import</MenuItem>
        <MenuItem target="/settings">Settings</MenuItem>
      </MenuBar>
    </Paper>
  );
};
