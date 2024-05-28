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
import React, { useRef, useEffect, useOptimistic, useState, use } from 'react';
import { useFormState } from 'react-dom';
import { addNames } from 'app/actions';
import { theme } from 'styles/theme';
import { ListWithNames } from 'types/types';
import { NamesList } from './NamesList';
import { Submit } from './Submit';

export const NamesForm: React.FC<{ list: ListWithNames[] }> = ({ list }) => {
  const Swal = require('sweetalert2');
  const { user, isLoading } = useUser();
  const [textField, setTextField] = useState('');
  const [newNameList, setNewNameList] = useState<ListWithNames[]>([
    { name: '', user: '', id: 1 }
  ]);
  const [statusMessage, formAction] = useFormState(addNames, null);
  const [optimisticNameList, addOptimisticNameList] = useOptimistic(
    list,
    (state, newNames: ListWithNames[]) => {
      return [...state, ...newNames];
    }
  );

  useEffect(() => {
    const lowerCaseNamesArray = textField
      .split(/[\n,]/)
      .map((name) => name.trim().toLowerCase())
      .filter((name) => name === name);

    const namesList = list.map((item) => item.name.toLowerCase());
    const withoutDuplicates = lowerCaseNamesArray.filter(
      (lowerCaseName) => !namesList.includes(lowerCaseName)
    );
    if (user) {
      const newNameList = withoutDuplicates.map((name, index) => {
        return {
          name: name,
          id: -index,
          user: user.sub || ''
        };
      });
      setNewNameList(newNameList);
    }
  }, [user, list, textField]);

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
            Swal.fire({
              title: 'Är du säker?',
              text: 'Om du lägger till ett namn så måste ni klicka på redoknappen igen',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: theme.palette.success.main,
              cancelButtonColor: theme.palette.secondary.main
            }).then(async (result: any) => {
              if (result.isConfirmed) {
                addOptimisticNameList(newNameList);
                formAction(formData);
              }
            });
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
            <input
              type="hidden"
              name="newNameList"
              value={newNameList.map((item) => item.name)}
            />
            <Submit disabled={textField === ''}>Lägg till</Submit>
          </Stack>
        </form>
      </div>
    </>
  );
};
