'use server';

import { PrismaClient } from '@prisma/client';
import { revalidateTag } from 'next/cache';
import { StatusMessage } from 'types/types';

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
