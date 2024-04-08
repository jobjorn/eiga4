'use server';

import { PrismaClient, Vote } from '@prisma/client';
import { revalidateTag } from 'next/cache';
import { StatusMessage } from 'types/types';
import { ListWithNames } from 'types/types';
import { getSession } from '@auth0/nextjs-auth0';
import { unstable_cache } from 'next/cache';

const prisma = new PrismaClient({
  log: ['warn', 'error']
});

/* nedan fem funktioner borde flyttas över till egna actions-filer där de hör hemma */

export async function addNames(
  previousState: StatusMessage | null | undefined,
  formData: FormData
) {
  if (formData === null) {
    return {
      severity: 'error',
      message: 'FormData var null.'
    };
  }
  let namesString = '';
  let namesArray: string[] = [];
  const session = await getSession();
  const user = session?.user ?? null;

  namesString = formData.get('names') as string;
  namesArray = namesString.split(/[\n,]/).map((name) => name.trim());

  if (namesArray.includes('Jobjörn')) {
    return {
      severity: 'error',
      message: `Jobjörn är upptaget, du kan inte döpa ditt barn till det.`
    };
  }
  if (user === null) {
    return {
      severity: 'error',
      message: `Du är inte inloggad.`
    };
  }

  namesArray.forEach(async (name) => {
    await prisma.list.create({
      data: {
        user: {
          connect: {
            sub: user.sub
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

export async function removeName(previousState, formData: FormData) {
  if (formData === null) {
    return {
      severity: 'error',
      message: 'FormData var null.'
    };
  }

  const id = parseInt(formData.get('id') as string, 10);
  await prisma.list.delete({
    where: {
      id
    }
  });

  revalidateTag('list');
}

export async function addVote(
  userSub: string,
  previousState: StatusMessage | null | undefined,
  formData: FormData
): Promise<StatusMessage> {
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

export const getNameList = unstable_cache(
  async (): Promise<ListWithNames[]> => {
    const session = await getSession();
    const user = session?.user ?? null;

    if (!user) {
      return [];
    }

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
      const partnerResult = await prisma.list.findMany({
        where: {
          userSub: findPartner.partnering[0].partneredSub
        },
        include: {
          name: true,
          user: true
        },
        orderBy: {
          name: {
            name: 'asc'
          }
        }
      });

      const userResult = await prisma.list.findMany({
        where: {
          userSub: user.sub
        },
        include: {
          name: true,
          user: true
        },
        orderBy: {
          name: {
            name: 'asc'
          }
        }
      });

      const allNames = [...partnerResult, ...userResult];
      const names = allNames.flatMap((item) => {
        return [
          {
            name: item.name.name,
            user: item.user.email
          }
        ];
      });

      const allNamesSorted = names.sort((a, b) => {
        return a.name.localeCompare(b.name, 'sv');
      });

      return allNamesSorted;
    } else {
      return [];
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
