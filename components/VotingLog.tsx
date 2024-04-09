import { Typography } from '@mui/material';
import { Vote } from '@prisma/client';
import { useEffect, useState } from 'react';
import { ListWithNames } from 'types/types';

export const VotingLog: React.FC<{ votes: Vote[]; list: ListWithNames[] }> = ({
  votes,
  list
}) => {
  const [votingLog, setVotingLog] = useState<string[]>([]);

  useEffect(() => {
    let newVotingLog: string[] = [];
    votes.map((vote) => {
      const winner = list.find((item) => item.nameId === vote.winnerId) || {
        name: { name: '???' }
      };
      const loser = list.find((item) => item.nameId === vote.loserId) || {
        name: { name: '???' }
      };
      newVotingLog.push(`${winner.name.name} > ${loser.name.name}`);
    });

    setVotingLog(newVotingLog);
  }, [votes]);

  return (
    <>
      <Typography variant="h3">Röstningslogg</Typography>
      <ol>
        {votingLog.map((log, index) => (
          <li key={index}>{log}</li>
        ))}
      </ol>
    </>
  );
};
