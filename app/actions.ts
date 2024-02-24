'use server';

import { List, PrismaClient } from '@prisma/client';
import { revalidateTag } from 'next/cache';
import { StatusMessage } from 'types/types';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});

function createSubarrayProperty(arr) {
  if (arr.length < 1) {
    return arr;
  }
  if (arr.length === 1) {
    arr[0].subarray = '';
    return arr;
  }

  const mid = Math.floor(arr.length / 2);
  const leftHalf = arr.slice(0, mid);
  const rightHalf = arr.slice(mid);

  createSubarrayProperty(leftHalf);
  createSubarrayProperty(rightHalf);

  for (let i = 0; i < leftHalf.length; i++) {
    leftHalf[i].subarray = 'L' + leftHalf[i].subarray;
  }

  for (let i = 0; i < rightHalf.length; i++) {
    rightHalf[i].subarray = 'R' + rightHalf[i].subarray;
  }

  arr.splice(0, arr.length, ...leftHalf, ...rightHalf);

  return arr;
}

export async function startRanking(userSub: string) {
  const userLists = await prisma.list.findMany({
    where: {
      user: {
        sub: userSub
      }
    }
  });

  //  console.log('userLists', userLists);

  const depth = Math.ceil(Math.log(userLists.length) / Math.log(2));

  const userListsWithSubarray = createSubarrayProperty(userLists);
  userListsWithSubarray.map(async (name) => {
    await prisma.list.update({
      where: {
        id: name.id
      },
      data: {
        subarray: name.subarray
      }
    });
  });

  revalidateTag('list');

  return {
    severity: 'success',
    message: 'Allt verkar ha gått bra.'
  };
}

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
) {
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
