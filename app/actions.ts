'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});

export async function addNames(userSub: string, formData: FormData) {
  let namesString = '';
  let namesArray: string[] = [];

  namesString = formData.get('names') as string;
  namesArray = namesString.split(/[\n,]/).map((name) => name.trim());

  console.log(namesArray);

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

  return namesArray;
}
