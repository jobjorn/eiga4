'use client';

import React, { useRef, useEffect } from 'react';
import {
  Alert,
  Box,
  Button,
  Skeleton,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { startRanking } from 'app/actions';
import { useFormStatus, useFormState } from 'react-dom';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Submit } from './Submit';

export const OverviewListForm: React.FC<{}> = () => {
  const { user, isLoading } = useUser();

  const startRankingWithId = startRanking.bind(null, user?.sub);

  const [statusMessage, formAction] = useFormState(startRankingWithId, null);
  const formElement = useRef<HTMLFormElement>(null);

  useEffect(() => {
    console.log('statusMessage', statusMessage);
    console.log('formElement', formElement);
    if (statusMessage?.severity !== 'error' && formElement.current) {
      formElement.current.reset();
    }
  }, [statusMessage]);

  if (isLoading) {
    return (
      <>
        <Skeleton variant="rectangular" height={60} />;
      </>
    );
  }

  if (!user || !user.sub) {
    return (
      <>
        <Box mt={2}>
          <Alert severity="error">Ej inloggad!</Alert>
        </Box>
      </>
    );
  }

  return (
    <>
      {statusMessage && (
        <Box mt={2}>
          <Alert severity={statusMessage.severity}>
            {statusMessage.message}
          </Alert>
        </Box>
      )}
      <form action={formAction} ref={formElement}>
        <Submit>Starta rankning</Submit>
      </form>
    </>
  );
};
