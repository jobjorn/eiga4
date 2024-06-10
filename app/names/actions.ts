'use server';

import { PrismaClient } from '@prisma/client';
import { revalidateTag } from 'next/cache';
import { getUserWithPartners } from 'app/overview/actions';
import { ListWithNames, StatusMessage, UserWithPartners } from 'types/types';

const prisma = new PrismaClient({ log: ['warn', 'error'] });

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

  const user: UserWithPartners | null = await getUserWithPartners();

  if (!user) {
    return {
      severity: 'error',
      message: 'Du verkar inte vara inloggad.',
      timestamp: Date.now()
    };
  }

  let hasPartner = false;
  if (user.partnering.length > 0 && user.partnered.length > 0) {
    // Om användaren har en partner
    hasPartner = true;
  }

  const namesList = formData.get('newNameList')?.toString().split(',') ?? [];

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
      .then(async () => {
        await prisma.user.update({
          where: {
            sub: user.sub
          },
          data: {
            readyToVote: false
          }
        });

        if (hasPartner) {
          await prisma.user.update({
            where: {
              sub: user.partnering[0].partnered?.sub
            },
            data: {
              readyToVote: false
            }
          });
        }
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
    let namesListString =
      namesList.slice(0, -1).join(', ') + ' och ' + namesList.slice(-1);

    return {
      severity: 'success',
      message: `Namnen ${namesListString} har lagts till.`,
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

  const user: UserWithPartners | null = await getUserWithPartners();

  if (!user) {
    return {
      severity: 'error',
      message: 'Du verkar inte vara inloggad.',
      timestamp: Date.now()
    };
  }

  const nameId = parseInt(formData.get('remove') as string, 10);
  await prisma.list.delete({
    where: {
      userSub_nameId: {
        nameId: nameId,
        userSub: user.sub
      }
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

  const updatedNames = names.map((item) => {
    const duplicateIndex = names.findIndex(
      (name) => name.nameId === item.nameId && name.id !== item.id
    );
    if (duplicateIndex !== -1) {
      const duplicate = names[duplicateIndex];
      const double = true;
      const doubleAvatar = duplicate.avatar;

      names.splice(duplicateIndex, 1);

      return {
        ...item,
        double,
        doubleAvatar
      };
    }
    return item;
  });

  const allNamesSorted = updatedNames.sort((a, b) => {
    return a.name.localeCompare(b.name, 'sv');
  });

  return allNamesSorted;
}

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
