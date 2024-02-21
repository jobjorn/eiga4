import React from 'react';
import { Typography } from '@mui/material';
import { getSession } from '@auth0/nextjs-auth0';
import { Prisma, PrismaClient } from '@prisma/client';
import { unstable_cache } from 'next/cache';
import { OverviewForm } from './OverviewForm';
import { OverviewList } from './OverviewList';

export const Overview: React.FC<{}> = async () => {
  const session = await getSession();
  const user = session?.user ?? null;
  if (!user) {
    return null;
  }

  return (
    <>
      <Typography variant="h4">Översikt</Typography>

      <OverviewList />
      <OverviewForm />
      <div>hej</div>
    </>
  );
};
