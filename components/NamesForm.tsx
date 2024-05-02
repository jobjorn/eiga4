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

  /*
    i andra funktioner har jag byggt så att den inloggades user.sub hämtas
    direkt i funktionen istället för att skickas med såhär - det är säkrare
    (pga mindre user input) och man slipper hela den här .bind-grejen, så
    vi kanske borde ändra på den här också
  */
  if (!user?.sub || isLoading) {
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
  const addNamesWithId = addNames.bind(null, user?.sub);

  const [statusMessage, formAction] = useFormState(addNamesWithId, null);

  const formElement = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (statusMessage?.severity !== 'error' && formElement.current) {
      formElement.current.reset();
    }
  }, [statusMessage]);

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
                name: {
                  id: -index,
                  name: name,
                  description: null
                },
                id: -index,
                userSub: user.sub || '',
                nameId: -index,
                subarray: null,
                position: 0
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
      <NamesList list={optimisticNameList} />
    </>
  );
};
