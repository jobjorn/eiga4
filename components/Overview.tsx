import React from 'react';
import { Typography } from '@mui/material';
import { getSession } from '@auth0/nextjs-auth0';
import { OverviewForm } from './OverviewForm';
import { OverviewList } from './OverviewList';
import { VotingMain } from './VotingMain';

export const Overview: React.FC<{}> = async () => {
  const session = await getSession();
  const user = session?.user ?? null;
  if (!user) {
    return null;
  }

  return (
    <>
      <Typography variant="h4">Översikt</Typography>
      <VotingMain />
    </>
  );
};
