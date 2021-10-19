import { useRouter } from 'next/router';
import { styled } from '@mui/system';

const MenuItem = styled('li')({ color: 'red' });

export const Menu: React.FC<{}> = () => {
  const router = useRouter();
  return (
    <div id="bar">
      <p>Bar2 Just nu besöker du: {router.pathname}</p>
      <ul>
        <MenuItem
          className={router.pathname === '/list' ? 'active' : undefined}
        >
          List
        </MenuItem>
        <MenuItem className={router.pathname === '/log' ? 'active' : undefined}>
          Log
        </MenuItem>
        <MenuItem
          className={router.pathname === '/import' ? 'active' : undefined}
        >
          Import
        </MenuItem>
        <MenuItem
          className={router.pathname === '/settings' ? 'active' : undefined}
        >
          Settings
        </MenuItem>
      </ul>
    </div>
  );
};
