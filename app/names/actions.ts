'use server';

import { getSession } from '@auth0/nextjs-auth0';
import { PrismaClient } from '@prisma/client';
import { StatusMessage } from 'types/types';

const prisma = new PrismaClient({ log: ['warn', 'error'] });

export async function startVoting(
  previousState: StatusMessage | null | undefined,
  formData?: FormData,
  readyToVote?: boolean
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

  const findPartner = await prisma.user.findUnique({
    where: {
      sub: user.sub
    },
    include: {
      partnering: true
    }
  });

  if (
    findPartner?.partnering[0].partneredAccepted === true &&
    findPartner?.partnering[0].partneredSub !== null
  ) {
    await prisma.user.update({
      where: {
        sub: findPartner.partnering[0].partneredSub
      },
      data: {
        readyToVote: false
      }
    });
    // fånga eventuellt error här
  }

  if (!dbUser) {
    return {
      severity: 'error',
      message: 'Du verkar inte vara registrerad.',
      timestamp: Date.now()
    };
  } else if (dbUser && readyToVote === false) {
    if (dbUser) {
      await prisma.user.update({
        where: {
          sub: user.sub
        },
        data: {
          readyToVote: false
        }
      });
      return {
        severity: 'success',
        message: `Är du redo att rösta?`,
        timestamp: Date.now()
      };
    }
  } else if (dbUser) {
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

  // Om inget ovan gick igenom körs detta ending return statement
  return {
    severity: 'error',
    message: 'Något gick fel.',
    timestamp: Date.now()
  };
}
/*
 * Uppdatera readyToVote, så det är en aktuell knapp där nere
 */
