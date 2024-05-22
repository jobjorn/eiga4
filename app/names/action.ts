'use server';

import { getSession } from '@auth0/nextjs-auth0';
import { PrismaClient } from '@prisma/client';
import { StatusMessage } from 'types/types';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});

export async function startVoting(
  previousState: StatusMessage | null | undefined,
  formData: FormData
): Promise<StatusMessage> {
  if (formData === null) {
    return {
      severity: 'error',
      message: 'Ingen data i formuläret.',
      timestamp: Date.now()
    };
  }
  const session = await getSession();
  const user = session?.user ?? null;

  if (!user) {
    return {
      severity: 'error',
      message: 'Du verkar inte vara inloggad.',
      timestamp: Date.now()
    };
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      sub: user.sub
    }
  });

  if (!dbUser) {
    return {
      severity: 'error',
      message: 'Du verkar inte vara registrerad.',
      timestamp: Date.now()
    };
  }
  if (dbUser) {
    await prisma.user.update({
      where: {
        sub: user.sub
      },
      data: {
        readyToVote: true
      }
    });
    return {
      severity: 'success',
      message: `Du är nu redo att rösta.`,
      timestamp: Date.now()
    };
  }

  console.log('DBUSER', dbUser);
}
