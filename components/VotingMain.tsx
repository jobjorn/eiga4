import React from 'react';

import { getSession } from '@auth0/nextjs-auth0';
import { Prisma, PrismaClient, Vote } from '@prisma/client';
import { unstable_cache } from 'next/cache';
import { Typography } from '@mui/material';
import { VotingDuel } from './VotingDuel';

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

const getVotes = unstable_cache(
  async (): Promise<Vote[]> => {
    const session = await getSession();
    const user = session?.user ?? null;
    if (!user) {
      return [];
    }

    const result = await prisma.vote.findMany({
      where: {
        userSub: user.sub
      }
    });

    if (result.length === 0) {
      return [];
    } else {
      return result;
    }
  },
  ['votes'],
  { tags: ['votes'] }
);

export const VotingMain: React.FC<{}> = async () => {
  const list = await getList();
  const votes = await getVotes();

  return (
    <>
      <VotingDuel list={list} votes={votes} />
    </>
  );
};
