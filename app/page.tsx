import { getSession } from '@auth0/nextjs-auth0';

export default async function Page() {
  const session = await getSession();
  const user = session?.user ?? null;
  console.log(user);

  return (
    <div>
      <h1>Hello world</h1>
      <a href="/api/auth/login">Login</a>
    </div>
  );
}
