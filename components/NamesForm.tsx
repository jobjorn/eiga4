'use client';

import React, { useRef, useEffect } from 'react';
import {
  Alert,
  Box,
  Skeleton,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { addNames } from 'app/actions';
import { useFormState } from 'react-dom';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Submit } from './Submit';

export const NamesForm: React.FC<{}> = () => {
  const { user, isLoading } = useUser();

  const addNamesWithId = addNames.bind(null, user?.sub);

  const [statusMessage, formAction] = useFormState(addNamesWithId, null);
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
        <Typography variant="h5">Lägg till nya namn</Typography>
        <Skeleton variant="rectangular" height={60} />;
      </>
    );
  }

  if (!user || !user.sub) {
    return (
      <>
        <Typography variant="h5">Lägg till nya namn</Typography>
        <Box mt={2}>
          <Alert severity="error">Ej inloggad!</Alert>
        </Box>
      </>
    );
  }

  return (
    <>
      <Typography variant="h5">Lägg till nya namn</Typography>
      {statusMessage && (
        <Box mt={2}>
          <Alert severity={statusMessage.severity}>
            {statusMessage.message}
          </Alert>
        </Box>
      )}
      <form action={formAction} ref={formElement}>
        <Stack spacing={2}>
          <TextField label="Namn" name="names" multiline minRows={3} />
        </Stack>
        <Submit>Lägg till</Submit>
      </form>
    </>
  );
};
