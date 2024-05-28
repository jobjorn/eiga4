'use server';

import { getSession } from '@auth0/nextjs-auth0';
import { PrismaClient } from '@prisma/client';
import { revalidateTag } from 'next/cache';
import { StatusMessage, UserWithPartners } from 'types/types';

const prisma = new PrismaClient({ log: ['warn', 'error'] });

export async function getUserWithPartners(): Promise<UserWithPartners | null> {
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
}

export async function addPartnership(
  previousState: StatusMessage | null | undefined,
  formData: FormData
): Promise<StatusMessage> {
  if (formData === null) {
    return {
      severity: 'error',
      message: 'Ingen data i formuläret.',
      timestamp: Date.now()
    };
  }

  const session = await getSession();
  const user = session?.user ?? null;
  if (!user) {
    return {
      severity: 'error',
      message: 'Du verkar ej vara inloggad.',
      timestamp: Date.now()
    };
  }

  const newPartnerEmail = formData.get('email') as string;

  if (newPartnerEmail === user.email) {
    return {
      severity: 'error',
      message: 'Du kan inte vara din egen partner.',
      timestamp: Date.now()
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

    revalidateTag('partner');

    return {
      severity: 'success',
      message: `Inbjudan till ${newPartnerEmail} skickad.`,
      timestamp: Date.now()
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

  revalidateTag('partner');

  return {
    severity: 'success',
    message: `Inbjudan till ${newPartnerEmail} skickad.`,
    timestamp: Date.now()
  };
}

export async function cancelPartnership(
  previousState: StatusMessage | null | undefined,
  formData: FormData
): Promise<StatusMessage> {
  if (formData === null) {
    return {
      severity: 'error',
      message: 'Ingen data i formuläret.',
      timestamp: Date.now()
    };
  }

  const session = await getSession();
  const user = session?.user ?? null;
  if (!user) {
    return {
      severity: 'error',
      message: 'Du verkar ej vara inloggad.',
      timestamp: Date.now()
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
      message: 'Något gick fel.',
      timestamp: Date.now()
    };
  } finally {
    revalidateTag('partner');

    return {
      severity: 'success',
      message: 'Inbjudan avbröts.',
      timestamp: Date.now()
    };
  }
}

export async function invitationPartnership(
  previousState: StatusMessage | null | undefined,
  formData: FormData
): Promise<StatusMessage> {
  if (formData === null) {
    return {
      severity: 'error',
      message: 'Ingen data i formuläret.',
      timestamp: Date.now()
    };
  }

  const session = await getSession();
  const user = session?.user ?? null;
  if (!user) {
    return {
      severity: 'error',
      message: 'Du verkar ej vara inloggad.',
      timestamp: Date.now()
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
        message: 'Inbjudan hittades ej.',
        timestamp: Date.now()
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
          },
          partneredAccepted: true
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
          },
          partneredAccepted: true
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
          },
          partneredAccepted: true
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
          },
          partneredAccepted: true
        }
      });
    } catch (e) {
      console.log(e);
      return {
        severity: 'error',
        message: 'Något gick fel.',
        timestamp: Date.now()
      };
    } finally {
      revalidateTag('partner');

      return {
        severity: 'success',
        message: 'Inbjudan accepterades.',
        timestamp: Date.now()
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
        message: 'Något gick fel.',
        timestamp: Date.now()
      };
    } finally {
      revalidateTag('partner');

      return {
        severity: 'success',
        message: 'Inbjudan nekades.',
        timestamp: Date.now()
      };
    }
  } else {
    return {
      severity: 'error',
      message: 'Något gick fel.',
      timestamp: Date.now()
    };
  }
}

export async function severPartnership(
  previousState: StatusMessage | null | undefined,
  formData: FormData
): Promise<StatusMessage> {
  if (formData === null) {
    return {
      severity: 'error',
      message: 'Ingen data i formuläret.',
      timestamp: Date.now()
    };
  }

  const session = await getSession();
  const user = session?.user ?? null;
  if (!user) {
    return {
      severity: 'error',
      message: 'Du verkar ej vara inloggad.',
      timestamp: Date.now()
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
      message: 'Något gick fel.',
      timestamp: Date.now()
    };
  } finally {
    revalidateTag('partner');

    return {
      severity: 'success',
      message: 'Partnerskapet avslutades.',
      timestamp: Date.now()
    };
  }
}
