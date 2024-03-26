import { getSession } from '@auth0/nextjs-auth0';
import { PrismaClient } from '@prisma/client';
import { Alert, Button, Stack, Typography } from '@mui/material';
import { PartnerBox } from 'components/PartnerBox';
import { RoundedBox } from './uicomponents/RoundedBox';

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
      <Stack spacing={2}>
        <Typography variant="h3">
          {user?.name ? `Inloggad som ${user.name}` : 'Ej inloggad'}
        </Typography>
        <Typography variant="body1">
          Här har vi en splash. Vetefan vad vi ska ha här. Kanske ska man
          omdirigeras automatiskt till /overview om man är inloggad?
        </Typography>
        <Stack spacing={1} direction="row">
          <Button variant="contained">En knapp</Button>
          <Button variant="outlined">En knapp till</Button>
        </Stack>

        <Stack spacing={1} direction="row">
          <Button color="secondary" variant="contained">
            En sekundär knapp
          </Button>
          <Button color="secondary" variant="outlined">
            En sekundär knapp till
          </Button>
        </Stack>
        <Stack spacing={1}>
          <PartnerBox>PartnerBox (används på Översiktssidan)</PartnerBox>

          <RoundedBox>
            <p>Hej hopp</p>
            <p>Hallå två</p>
          </RoundedBox>
          <Alert severity="error">Error</Alert>
          <Alert severity="warning">Warning</Alert>
          <Alert severity="info">Info</Alert>
          <Alert severity="success">Success</Alert>
        </Stack>
      </Stack>
    </>
  );
}
