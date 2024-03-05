'use server';

import { PrismaClient, Vote } from '@prisma/client';
import { revalidateTag } from 'next/cache';
import { StatusMessage } from 'types/types';
import { ListWithNames } from 'types/types';
import { getSession } from '@auth0/nextjs-auth0';
import { unstable_cache } from 'next/cache';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});

export async function addNames(
  userSub: string,
  previousState: StatusMessage | null | undefined,
  formData: FormData
) {
  console.log({ previousState, userSub, formData });

  if (formData === null) {
    return {
      severity: 'error',
      message: 'FormData var null.'
    };
  }
  let namesString = '';
  let namesArray: string[] = [];

  namesString = formData.get('names') as string;
  namesArray = namesString.split(/[\n,]/).map((name) => name.trim());

  if (namesArray.includes('Jobjörn')) {
    return {
      severity: 'error',
      message: `Jobjörn är upptaget, du kan inte döpa ditt barn till det.`
    };
  }

  namesArray.forEach(async (name) => {
    await prisma.list.create({
      data: {
        user: {
          connect: {
            sub: userSub
          }
        },
        name: {
          connectOrCreate: {
            where: {
              name: name
            },
            create: {
              name: name
            }
          }
        },
        position: 1
      }
    });
  });

  revalidateTag('list');

  return {
    severity: 'success',
    message: 'Allt verkar ha gått bra.'
  };
}

export async function addVote(
  userSub: string,
  previousState: StatusMessage | null | undefined,
  formData: FormData
): Promise<StatusMessage> {
  console.log('addVote:', { previousState, userSub, formData });

  if (formData === null) {
    return {
      severity: 'error',
      message: 'FormData var null.'
    };
  }

  const winner = formData.get('winner') as string;
  console.log('winner:', winner);

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
    message: 'Allt verkar ha gått bra.'
  };
}

export const getList = unstable_cache(
  async (): Promise<ListWithNames[]> => {
    const session = await getSession();
    const user = session?.user ?? null;
    if (!user) {
      return [];
    }

    const result = await prisma.list.findMany({
      where: {
        userSub: user.sub
      },
      include: {
        name: true
      },
      orderBy: {
        name: {
          name: 'asc'
        }
      }
    });

    if (result.length === 0) {
      return [];
    } else {
      return result;
    }
  },
  ['list'],
  { tags: ['list'] }
);

export const getVotes = unstable_cache(
  async (): Promise<Vote[]> => {
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
  },
  ['votes'],
  { tags: ['votes'] }
);
