import { getSession } from '@auth0/nextjs-auth0';
import { Overview } from 'components/Overview';
import { Splash } from 'components/Splash';
import { PrismaClient } from '@prisma/client';

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

    return <Overview />;
  } else {
    return <Splash />;
  }
}
