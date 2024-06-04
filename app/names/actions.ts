'use server';

import { PrismaClient } from '@prisma/client';
import { getUserWithPartners } from 'app/overview/actions';
import { StatusMessage, UserWithPartners } from 'types/types';

const prisma = new PrismaClient({ log: ['warn', 'error'] });

export async function toggleReadyToVote(
  previousState: StatusMessage | null | undefined,
  formData?: FormData
): Promise<StatusMessage> {
  if (formData === null) {
    return {
      severity: 'error',
      message: 'Ingen data i formuläret.',
      timestamp: Date.now()
    };
  }

  const user: UserWithPartners | null = await getUserWithPartners();

  if (!user) {
    return {
      severity: 'error',
      message: 'Du verkar inte vara inloggad.',
      timestamp: Date.now()
    };
  }

  if (user && user.readyToVote === true) {
    if (user) {
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
        message: `Du har markerat att du inte är redo att rösta.`,
        timestamp: Date.now()
      };
    }
  } else if (user && user.readyToVote === false) {
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
