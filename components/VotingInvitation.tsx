'use client';
import { Button, Typography } from '@mui/material';
import { Submit } from './Submit';
import { useRef } from 'react';
import { useFormState } from 'react-dom';
import { startVoting } from 'app/names/action';

export const VotingInvitation: React.FC<{}> = ({}) => {
  const [statusMessageStartVote, formActionStartVote] = useFormState(
    startVoting,
    null
  );
  const formElement = useRef<HTMLFormElement>(null);
  return (
    <form action={formActionStartVote} ref={formElement}>
      <Submit variant="contained" color="primary">
        Påbörja omröstning
      </Submit>
    </form>
  );
};
