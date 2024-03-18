'use client';
import React, { useRef, useEffect, useOptimistic, useState } from 'react';
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
import { ListWithNames } from 'types/types';
import { NamesList } from './NamesList';

export const NamesForm: React.FC<{ list: ListWithNames[] }> = ({ list }) => {
  const { user, isLoading } = useUser();
  const [textField, setTextField] = useState('');
  const [optimisticNameList, addOptimisticNameList] = useOptimistic(
    list,
    (state, newNames: ListWithNames[]) => {
      return [...state, ...newNames];
    }
  );

  const addNamesWithId = addNames.bind(null, user?.sub);

  const [statusMessage, formAction] = useFormState(addNamesWithId, null);

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
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}
      ></div>
    </>
  );
};
