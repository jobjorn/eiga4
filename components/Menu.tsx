import { useRouter } from 'next/router';
import { styled } from '@mui/system';

interface MenuItemProps {
  active: boolean;
}

const MenuItem = styled('li')<MenuItemProps>((props) => ({
  color: props.active ? 'green' : 'red'
}));

// temat kommer du åt via props.theme.whatever

export const Menu: React.FC<{}> = () => {
  const router = useRouter();
  return (
    <div id="bar">
      <p>Bar2 Just nu besöker du: {router.pathname}</p>
      <ul>
        <MenuItem active={router.pathname === '/list'}>List</MenuItem>
        <MenuItem active={router.pathname === '/log'}>Log</MenuItem>
        <MenuItem active={router.pathname === '/import'}>Import</MenuItem>
        <MenuItem active={router.pathname === '/settings'}>Settings</MenuItem>
      </ul>
    </div>
  );
};
