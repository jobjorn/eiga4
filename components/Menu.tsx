import { useRouter } from 'next/router';
import { styled } from '@mui/system';
import React from 'react';
import Link from 'next/link';

interface MenuItemLiProps {
  active: boolean;
}

const MenuItemLi = styled('li')<MenuItemLiProps>((props) => ({
  display: 'inline-block',
  padding: '15px',
  backgroundColor: props.active ? 'black' : 'inherit'
}));

interface MenuItemProps {
  target: string;
}

const StyledA = styled('a')(({}) => ({
  color: 'white',
  textDecoration: 'none'
}));

const MenuItem: React.FC<MenuItemProps> = (props) => {
  const router = useRouter();
  return (
    <MenuItemLi active={router.pathname === props.target}>
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

// temat kommer du åt via props.theme.whatever

export const Menu: React.FC<{}> = () => {
  const router = useRouter();
  return (
    <MenuBar>
      <MenuItem target="/">Home</MenuItem>
      <MenuItem target="/list">List</MenuItem>
      <MenuItem target="/log">Log</MenuItem>
      <MenuItem target="/import">Import</MenuItem>
      <MenuItem target="/settings">Settings</MenuItem>
    </MenuBar>
  );
};
