'use server';

import { getSession } from '@auth0/nextjs-auth0';
import { PrismaClient, Vote } from '@prisma/client';
import { revalidateTag } from 'next/cache';
import { getUserWithPartners } from 'app/overview/actions';
import { StatusMessage } from '../../types/types';

const prisma = new PrismaClient({
  log: ['warn', 'error']
});

export async function addVote(
  userSub: string,
  previousState: StatusMessage | null | undefined,
  formData: FormData
): Promise<StatusMessage> {
  if (formData === null) {
    return {
      severity: 'error',
      message: 'FormData var null.',
      timestamp: Date.now()
    };
  }

  const winner = formData.get('winner') as string;

  const left = parseInt(formData.get('left') as string, 10);
  const right = parseInt(formData.get('right') as string, 10);

  let winnerId: number;
  let loserId: number;
  if (winner === 'left') {
    winnerId = left;
    loserId = right;
  } else {
    winnerId = right;
    loserId = left;
  }

  await prisma.vote.create({
    data: {
      user: {
        connect: {
          sub: userSub
        }
      },
      winner: {
        connect: {
          id: winnerId
        }
      },
      loser: {
        connect: {
          id: loserId
        }
      }
    }
  });

  revalidateTag('votes');

  return {
    severity: 'success',
    message: 'Rösten registrerades.',
    timestamp: Date.now()
  };
}

export async function getVotes(): Promise<Vote[]> {
  const session = await getSession();
  const user = session?.user ?? null;
  if (!user) {
    return [];
  }

  const result = await prisma.vote.findMany({
    where: {
      userSub: user.sub
    }
  });

  if (result.length === 0) {
    return [];
  } else {
    return result;
  }
}

export async function getPartnerVotes(): Promise<Vote[]> {
  const user = await getUserWithPartners();
  if (!user) {
    return [];
  }

  const partner = user.partnering[0].partnered;
  if (!partner || user.partnering[0].partneredAccepted === false) {
    return [];
  }

  const result = await prisma.vote.findMany({
    where: {
      userSub: partner.sub
    }
  });

  if (result.length === 0) {
    return [];
  } else {
    return result;
  }
}
