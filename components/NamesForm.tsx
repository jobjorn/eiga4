'use client';

import { Alert, Box, Stack, TextField, Typography } from '@mui/material';
import React, { useRef, useEffect, useOptimistic, useState } from 'react';
import { useFormState } from 'react-dom';
import { addNames } from 'app/actions';
import { toTitleCase } from 'lib/toTitleCase';
import { theme } from 'styles/theme';
import { ListWithNames, UserWithPartners } from 'types/types';
import { NamesList } from './NamesList';
import { Submit } from './Submit';

export const NamesForm: React.FC<{
  user: UserWithPartners;
  list: ListWithNames[];
  hasPartner: boolean;
}> = ({ user, list, hasPartner }) => {
  const Swal = require('sweetalert2');
  const [textField, setTextField] = useState('');
  const [newNameList, setNewNameList] = useState<ListWithNames[]>([]);
  const [statusMessage, formAction] = useFormState(addNames, null);
  const [optimisticNameList, addOptimisticNameList] = useOptimistic(
    list,
    (state, newNames: ListWithNames[]) => {
      return [...state, ...newNames];
    }
  );
  const [readyToProceed, setReadyToProceed] = useState(false);
  const formElement = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const lowerCaseNamesArray = textField
      .split(/[\n,]/)
      .map((name) => toTitleCase(name.trim()))
      .filter((name) => name === name);

    const namesList = list.map((item) => item.name.toLowerCase());
    const withoutDuplicates = lowerCaseNamesArray.filter(
      (lowerCaseName) => !namesList.includes(lowerCaseName)
    );
    if (user && user.sub) {
      const newNameList: ListWithNames[] = withoutDuplicates.map(
        (name, index) => {
          return {
            name: name,
            id: -index,
            nameId: -index,
            user: user.sub || ''
          };
        }
      );
      setNewNameList(newNameList);
    }
  }, [user, list, textField]);

  useEffect(() => {
    if (hasPartner && user.readyToVote) {
      setReadyToProceed(true);
    }
  }, [user, hasPartner]);

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
      <NamesList list={optimisticNameList} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '5px'
        }}
      >
        <Typography variant="h5">Lägg till nya namn</Typography>
        <form
          action={async (formData) => {
            if (readyToProceed) {
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
            } else {
              addOptimisticNameList(newNameList);
              formAction(formData);
            }
          }}
          ref={formElement}
        >
          <Stack spacing={2}>
            <TextField
              label="Första, andra, tredje..."
              name="names"
              multiline
              minRows={3}
              onChange={(event) => setTextField(event.target.value.trim())}
            />
            <input
              type="hidden"
              name="newNameList"
              value={newNameList.map((item) => item.name)}
            />
            <Submit disabled={textField === ''}>Lägg till</Submit>
          </Stack>
          {statusMessage && (
            <Box mt={2}>
              <Alert severity={statusMessage.severity}>
                {statusMessage.message}
              </Alert>
            </Box>
          )}
        </form>
      </div>
    </>
  );
};
