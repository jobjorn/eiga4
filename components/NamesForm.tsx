'use client';
import { useUser } from '@auth0/nextjs-auth0/client';
import {
  Alert,
  Box,
  Skeleton,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import React, { useRef, useEffect, useOptimistic, useState } from 'react';
import { useFormState } from 'react-dom';
import { addNames } from 'app/actions';
import { ListWithNames } from 'types/types';
import { NamesList } from './NamesList';
import { Submit } from './Submit';

export const NamesForm: React.FC<{ list: ListWithNames[] }> = ({ list }) => {
  const { user, isLoading } = useUser();
  const [textField, setTextField] = useState('');
  const [optimisticNameList, addOptimisticNameList] = useOptimistic(
    list,
    (state, newNames: ListWithNames[]) => {
      return [...state, ...newNames];
    }
  );

  const [statusMessage, formAction] = useFormState(addNames, null);

  const formElement = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (statusMessage?.severity !== 'error' && formElement.current) {
      formElement.current.reset();
    }
  }, [statusMessage]);

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '5px'
        }}
      >
        <Typography variant="h5">Lägg till nya namn</Typography>
        <Skeleton variant="rectangular" height={60} />
      </div>
    );
  }

  if (!user || !user.sub) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '5px'
        }}
      >
        <Typography variant="h5">Lägg till nya namn</Typography>
        <Box mt={2}>
          <Alert severity="error">Ej inloggad!</Alert>
        </Box>
      </div>
    );
  }

  return (
    <>
      <NamesList list={optimisticNameList} user={user} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '5px'
        }}
      >
        <Typography variant="h5">Lägg till nya namn</Typography>
        {statusMessage && (
          <Box mt={2}>
            <Alert severity={statusMessage.severity}>
              {statusMessage.message}
            </Alert>
          </Box>
        )}
        <form
          action={async (formData) => {
            const namesString = formData.get('names') as string;
            const namesArray = namesString
              .split(/[\n,]/)
              .map((name) => name.trim());

            const newNameList = namesArray.map((name, index) => {
              return {
                name: name,
                id: -index,
                user: user.sub || ''
              };
            });
            /*
              jag har gjort om det här så att den genererar array-items som är kompatibla med
              typen ListWithNames, men useOptimistic verkar ändå inte funka så det är något
              mer som är fel
            */

            addOptimisticNameList(newNameList);
            await formAction(formData);
          }}
          ref={formElement}
        >
          <Stack spacing={2}>
            <TextField
              label="Namn"
              name="names"
              multiline
              minRows={3}
              onChange={(event) => setTextField(event.target.value)}
            />
            <Submit disabled={textField === ''}>Lägg till</Submit>
          </Stack>
        </form>
      </div>
    </>
  );
};
