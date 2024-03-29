'use server';

import { PrismaClient, Vote } from '@prisma/client';
import { getSession } from '@auth0/nextjs-auth0';
import { revalidateTag, unstable_cache } from 'next/cache';
import { StatusMessage, UserWithPartners } from 'types/types';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});

export const getUserWithPartners = unstable_cache(
  async (): Promise<UserWithPartners | null> => {
    const session = await getSession();
    const user = session?.user ?? null;
    if (!user) {
      return null;
    }

    const result = await prisma.user.findUnique({
      where: {
        sub: user.sub
      },
      include: {
        partnered: {
          include: {
            partnering: true,
            partnered: true
          }
        },
        partnering: {
          include: {
            partnering: true,
            partnered: true
          }
        }
      }
    });

    return result;
  },
  ['partner'],
  { tags: ['partner'] }
);

export async function addPartnership(
  previousState: StatusMessage | null | undefined,
  formData: FormData
) {
  if (formData === null) {
    return {
      severity: 'error',
      message: 'Ingen data i formuläret.'
    };
  }

  const session = await getSession();
  const user = session?.user ?? null;
  if (!user) {
    return {
      severity: 'error',
      message: 'Du verkar ej vara inloggad.'
    };
  }

  const newPartnerEmail = formData.get('email') as string;

  if (newPartnerEmail === user.email) {
    return {
      severity: 'error',
      message: 'Du kan inte vara din egen partner.'
    };
  }

  const newPartner = await prisma.user.findUnique({
    where: {
      email: newPartnerEmail
    }
  });

  if (newPartner === null) {
    await prisma.partnership.upsert({
      where: {
        partneringSub: user.sub
      },
      update: {
        partneredEmail: newPartnerEmail
      },
      create: {
        partnering: {
          connect: {
            sub: user.sub
          }
        },
        partneredEmail: newPartnerEmail
      }
    });

    revalidateTag('partners');

    return {
      severity: 'success',
      message: `Inbjudan till ${newPartnerEmail} skickad.`
    };
  }

  await prisma.partnership.upsert({
    where: {
      partneringSub: user.sub
    },
    update: {
      partnered: {
        connect: {
          sub: newPartner.sub
        }
      }
    },
    create: {
      partnering: {
        connect: {
          sub: user.sub
        }
      },
      partnered: {
        connect: {
          sub: newPartner.sub
        }
      }
    }
  });

  revalidateTag('partners');

  return {
    severity: 'success',
    message: `Inbjudan till ${newPartnerEmail} skickad.`
  };
}

export async function cancelPartnership(
  previousState: StatusMessage | null | undefined,
  formData: FormData
) {
  if (formData === null) {
    return {
      severity: 'error',
      message: 'Ingen data i formuläret.'
    };
  }

  const session = await getSession();
  const user = session?.user ?? null;
  if (!user) {
    return {
      severity: 'error',
      message: 'Du verkar ej vara inloggad.'
    };
  }

  try {
    await prisma.partnership.deleteMany({
      where: {
        partneringSub: user.sub
      }
    });
  } catch (e) {
    console.log(e);
    return {
      severity: 'error',
      message: 'Något gick fel.'
    };
  } finally {
    revalidateTag('partners');

    return {
      severity: 'success',
      message: 'Inbjudan avbröts.'
    };
  }
}

export async function invitationPartnership(
  previousState: StatusMessage | null | undefined,
  formData: FormData
) {
  if (formData === null) {
    return {
      severity: 'error',
      message: 'Ingen data i formuläret.'
    };
  }

  const session = await getSession();
  const user = session?.user ?? null;
  if (!user) {
    return {
      severity: 'error',
      message: 'Du verkar ej vara inloggad.'
    };
  }

  const denyOrAccept = formData.get('invitation') as string;

  if (denyOrAccept === 'accept') {
    const invitee = await prisma.partnership.findFirst({
      where: {
        partneredSub: user.sub
      }
    });

    if (invitee === null) {
      return {
        severity: 'error',
        message: 'Inbjudan hittades ej.'
      };
    }

    try {
      await prisma.partnership.upsert({
        where: {
          partneringSub: invitee.partneringSub
        },
        update: {
          partnered: {
            connect: {
              sub: user.sub
            }
          }
        },
        create: {
          partnering: {
            connect: {
              sub: invitee.partneringSub
            }
          },
          partnered: {
            connect: {
              sub: user.sub
            }
          }
        }
      });

      await prisma.partnership.upsert({
        where: {
          partneringSub: user.sub
        },
        update: {
          partnered: {
            connect: {
              sub: invitee.partneringSub
            }
          }
        },
        create: {
          partnering: {
            connect: {
              sub: user.sub
            }
          },
          partnered: {
            connect: {
              sub: invitee.partneringSub
            }
          }
        }
      });
    } catch (e) {
      console.log(e);
      return {
        severity: 'error',
        message: 'Något gick fel.'
      };
    } finally {
      revalidateTag('partners');

      return {
        severity: 'success',
        message: 'Inbjudan accepterades.'
      };
    }
  } else if (denyOrAccept === 'deny') {
    try {
      await prisma.partnership.deleteMany({
        where: {
          OR: [
            {
              partneredSub: user.sub
            },
            {
              partneringSub: user.sub
            }
          ]
        }
      });
    } catch (e) {
      console.log(e);
      return {
        severity: 'error',
        message: 'Något gick fel.'
      };
    } finally {
      revalidateTag('partners');

      return {
        severity: 'success',
        message: 'Inbjudan nekades.'
      };
    }
  } else {
    return {
      severity: 'error',
      message: 'Något gick fel.'
    };
  }
}

export async function severPartnership(
  previousState: StatusMessage | null | undefined,
  formData: FormData
) {
  if (formData === null) {
    return {
      severity: 'error',
      message: 'Ingen data i formuläret.'
    };
  }

  const session = await getSession();
  const user = session?.user ?? null;
  if (!user) {
    return {
      severity: 'error',
      message: 'Du verkar ej vara inloggad.'
    };
  }

  try {
    await prisma.partnership.deleteMany({
      where: {
        OR: [
          {
            partneredSub: user.sub
          },
          {
            partneringSub: user.sub
          }
        ]
      }
    });
  } catch (e) {
    console.log(e);
    return {
      severity: 'error',
      message: 'Något gick fel.'
    };
  } finally {
    revalidateTag('partners');

    return {
      severity: 'success',
      message: 'Partnerskapet avslutades.'
    };
  }
}
