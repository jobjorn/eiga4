import { useRouter } from 'next/router';

export const Menu: React.FC<{}> = () => {
  const router = useRouter();
  return (
    <div id="bar">
      <p>Bar2 Just nu besöker du: {router.pathname}</p>
      <ul>
        <li className={router.pathname === '/list' ? 'active' : undefined}>
          List
        </li>
        <li className={router.pathname === '/log' ? 'active' : undefined}>
          Log
        </li>
        <li className={router.pathname === '/import' ? 'active' : undefined}>
          Import
        </li>
        <li className={router.pathname === '/settings' ? 'active' : undefined}>
          Settings
        </li>
      </ul>
    </div>
  );
};
