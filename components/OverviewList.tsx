import React from 'react';
import { Typography } from '@mui/material';
import { getSession } from '@auth0/nextjs-auth0';
import { Prisma, PrismaClient } from '@prisma/client';
import { unstable_cache } from 'next/cache';

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

export const OverviewList: React.FC<{}> = async () => {
  const list = await getList();

  return (
    <>
      <Typography variant="h5">Namn</Typography>
      <ul>
        {list.map((item) => {
          return (
            <li key={item.id}>
              <Typography variant="body1">
                {item.name.name} - {item.subarray}
              </Typography>
            </li>
          );
        })}
      </ul>
    </>
  );
};
