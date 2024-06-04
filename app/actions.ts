'use server';

import { getSession } from '@auth0/nextjs-auth0';
import { PrismaClient } from '@prisma/client';
import { revalidateTag } from 'next/cache';
import { StatusMessage, ListWithNames, UserWithPartners } from '../types/types';
import { startVoting } from './names/actions';
import { getUserWithPartners } from './overview/actions';

const prisma = new PrismaClient({
  /*  log: ['warn', 'error'] */
});

/* nedan fem funktioner borde flyttas över till egna actions-filer där de hör hemma */

export async function addNames(
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
  /* let namesString = '';
  let namesArray: string[] = []; */
  const session = await getSession();
  const user = session?.user ?? null;
  const namesList = formData.get('newNameList')?.toString().split(',') ?? [];

  console.log('NamesList', namesList?.toString());
  console.log('FormDAta', formData);
  /* namesString = formData.get('names') as string;
  namesArray = namesString
    .split(/[\n,]/)
    .map((name) => name.trim().toLocaleLowerCase()); */

  if (namesList.includes('Jobjörn' || 'jobjörn')) {
    return {
      severity: 'error',
      message: `Jobjörn är upptaget, du kan inte döpa ditt barn till det.`,
      timestamp: Date.now()
    };
  }
  if (user === null) {
    return {
      severity: 'error',
      message: `Du är inte inloggad.`,
      timestamp: Date.now()
    };
  }

  namesList.forEach(async (name) => {
    await prisma.list
      .create({
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
      })
      .then(() => {
        startVoting(null, formData, false);
      });
  });

  revalidateTag('list');

  if (namesList.length === 1) {
    return {
      severity: 'success',
      message: `Namnet ${namesList[0]} har lagts till.`,
      timestamp: Date.now()
    };
  } else {
    return {
      severity: 'success',
      message: `Namnen ${namesList.join(', ')} har lagts till.`,
      timestamp: Date.now()
    };
  }
}

export async function removeName(
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

  const id = parseInt(formData.get('remove') as string, 10);
  await prisma.list.delete({
    where: {
      id
    }
  });

  revalidateTag('list');

  return {
    severity: 'success',
    message: 'Namnet raderades.',
    timestamp: Date.now()
  };
}

export async function getNameList(): Promise<ListWithNames[]> {
  const user: UserWithPartners | null = await getUserWithPartners();

  if (!user) {
    return [];
  }

  let partnerSub = '';
  if (user.partnering.length > 0 && user.partnered.length > 0) {
    partnerSub = user.partnering[0].partnered?.sub ?? '';
  }

  let results = [];
  if (partnerSub) {
    results = await prisma.list.findMany({
      where: {
        OR: [
          {
            userSub: user.sub
          },
          {
            userSub: partnerSub
          }
        ]
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
  } else {
    results = await prisma.list.findMany({
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
  }

  const names = results.flatMap((item) => {
    return [
      {
        name: item.name.name,
        user: item.user.email,
        id: item.id,
        nameId: item.name.id,
        avatar: item.user.picture ?? ''
      }
    ];
  });

  const allNamesSorted = names.sort((a, b) => {
    return a.name.localeCompare(b.name, 'sv');
  });

  return allNamesSorted;
}
