import { getSession } from '@auth0/nextjs-auth0';
import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';
import { PageTitle } from './uicomponents/PageTitle';

const prisma = new PrismaClient();

export default async function Page() {
  const session = await getSession();
  const user = session?.user ?? null;

  if (user) {
    // Add/update user in the Prisma database
    await prisma.user.upsert({
      where: { sub: user.sub },
      update: {
        name: user.name,
        email: user.email,
        picture: user.picture
      },
      create: {
        sub: user.sub,
        name: user.name,
        email: user.email,
        picture: user.picture
      }
    });
  }

  if (user) {
    // redirect to /overview
    redirect('/overview');
  }

  return (
    <>
      <PageTitle>Namnväljaren</PageTitle>
      <ol className="splashList">
        <li>Lägg in namnförslag</li>
        <li>Rangordna dem med hjälp av en sorteringsalgoritm</li>
        <li>Se resultatet</li>
      </ol>
    </>
  );
}
