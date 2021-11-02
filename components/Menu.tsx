import { useRouter } from 'next/router';
import { flexbox, styled } from '@mui/system';
import React from 'react';
import Link from 'next/link';

interface MenuItemProps {
  active: boolean;
}

interface MenuItemLinkProps {
  target: string;
}

const MenuItem = styled('li')<MenuItemProps>((props) => ({
  display: 'inline-block',
  padding: '15px',
  backgroundColor: props.active ? 'black' : 'inherit'
}));

const MenuItemLink: React.FC<MenuItemLinkProps> = (props) => {
  const router = useRouter();
  return (
    <MenuItem active={router.pathname === props.target}>
      <Link href={props.target}>
        <a>{props.children}</a>
      </Link>
    </MenuItem>
  );
};

const MenuBar = styled('ul')(({}) => ({
  color: 'white',
  backgroundColor: 'maroon',
  display: 'flexbox',
  flexDirection: 'column'
}));

// temat kommer du åt via props.theme.whatever

export const Menu: React.FC<{}> = () => {
  const router = useRouter();
  return (
    <MenuBar>
      <MenuItemLink target="/">Home</MenuItemLink>
      <MenuItemLink target="/list">List</MenuItemLink>
      <MenuItemLink target="/log">Log</MenuItemLink>
      <MenuItemLink target="/import">Import</MenuItemLink>
      <MenuItemLink target="/settings">Settings</MenuItemLink>
    </MenuBar>
  );
};
