'use client';
import React, { useRef } from 'react';
import { Alert, Avatar, Box, Typography } from '@mui/material';
import { removeName } from 'app/actions';
import { ListWithNames } from 'types/types';
import { Submit } from './Submit';
import { useFormState } from 'react-dom';
import { theme } from 'styles/theme';
import { AiOutlineClose } from 'react-icons/ai';

type NamesListProps = {
  list: ListWithNames[];
  user: any;
};
export const NamesList = (props: NamesListProps) => {
  const formElement = useRef<HTMLFormElement>(null);
  const [statusMessage, formAction] = useFormState(removeName, null);

  return (
    <form action={formAction} ref={formElement}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
          gap: '5px'
        }}
      >
        {props.list.map((item) => (
          <div
            key={item.id}
            style={{
              border: `1px solid ${theme.palette.primary.main}`,
              borderRadius: '5px',
              display: `flex`,
              justifyContent: `space-between`,
              alignItems: `center`,
              padding: '5px'
            }}
          >
            <div style={{ display: 'flex', gap: '5px' }}>
              {item.avatar !== undefined && (
                <Avatar
                  alt={item.user}
                  sx={{ bgcolor: theme.palette.primary.main }}
                  src={item.avatar}
                />
              )}
              <Typography variant="body1">{item.name}</Typography>
            </div>
            <Submit variant="text" name="remove" value={item.id}>
              <AiOutlineClose />
            </Submit>
          </div>
        ))}
        {statusMessage && (
          <Box mt={2}>
            <Alert severity={statusMessage.severity}>
              {statusMessage.message}
            </Alert>
          </Box>
        )}
      </div>
    </form>
  );
};
