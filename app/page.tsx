import { getSession } from '@auth0/nextjs-auth0';
import { PrismaClient } from '@prisma/client';
import { Typography } from '@mui/material';

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

  return (
    <>
      <Typography variant="h3">
        {user?.name ? `Inloggad som ${user.name}` : 'Ej inloggad'}
      </Typography>
      <Typography variant="body1">
        Här har vi en splash. Vetefan vad vi ska ha här. Kanske ska man
        omdirigeras automatiskt till /overview om man är inloggad?
      </Typography>
    </>
  );
}
