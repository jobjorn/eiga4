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
        partnered: true,
        partnering: true
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
  console.log({ previousState, formData });

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
      message: `Inbjudan till <strong>${newPartnerEmail}</strong> skickad.`
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
    message: `Inbjudan till <strong>${newPartnerEmail}</strong> skickad.`
  };
}
