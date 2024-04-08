'use client';

import { Typography } from '@mui/material';
import { Vote } from '@prisma/client';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { ListWithNames } from 'types/types';

export const VotingLog: React.FC<{ votes: Vote[]; list: ListWithNames[] }> = ({
  votes,
  list
}) => {
  const [votingLog, setVotingLog] = useState<JSX.Element[]>([]);

  useEffect(() => {
    let newVotingLog: JSX.Element[] = [];
    votes.map((vote) => {
      const winner = list.find((item) => item.nameId === vote.winnerId) || {
        name: { name: '???' }
      };
      const loser = list.find((item) => item.nameId === vote.loserId) || {
        name: { name: '???' }
      };
      let voteTime = DateTime.fromISO(new Date(vote.timestamp).toISOString())
        .setLocale('sv')
        .toRelative({ style: 'long' });

      newVotingLog.push(
        <li>
          {winner.name.name} &gt; {loser.name.name} ({voteTime}) (
          {vote.timestamp.getTimezoneOffset()})
        </li>
      );
    });

    setVotingLog(newVotingLog);
  }, [votes]);

  return (
    <>
      <Typography variant="h3">Logg över lagda röster</Typography>
      <ol>{votingLog}</ol>
    </>
  );
};
