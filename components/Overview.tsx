import React from 'react';
import { Typography } from '@mui/material';
import { getSession } from '@auth0/nextjs-auth0';
import { Prisma, PrismaClient } from '@prisma/client';
import { unstable_cache } from 'next/cache';
import { OverviewForm } from './OverviewForm';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});

export type ListWithNames = Prisma.ListGetPayload<{
  include: {
    name: true;
  };
}>;

const getList = unstable_cache(
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

export const Overview: React.FC<{}> = async () => {
  const session = await getSession();
  const user = session?.user ?? null;
  if (!user) {
    return null;
  }

  const list = await getList();

  return (
    <>
      <Typography variant="h4">Översikt</Typography>

      <Typography variant="h5">Namn</Typography>
      {list.map((item) => {
        return (
          <ul key={item.id}>
            <li>
              <Typography variant="body1">{item.name.name}</Typography>
            </li>
          </ul>
        );
      })}
      <OverviewForm />
    </>
  );
};
