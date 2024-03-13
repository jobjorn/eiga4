'use client';
import React, { useRef } from 'react';
import { Typography } from '@mui/material';
import { removeName } from 'app/actions';
import { ListWithNames } from 'types/types';
import { Submit } from './Submit';
import { useFormState } from 'react-dom';
import { theme } from 'styles/theme';

type NamesListProps = {
  list: ListWithNames[];
};
export const NamesList = (props: NamesListProps) => {
  const formElement = useRef<HTMLFormElement>(null);
  const [statusMessage, formAction] = useFormState(removeName, null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      {props.list.map((item) => {
        return (
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
            <Typography variant="body1">{item.name.name}</Typography>
            <form action={formAction} ref={formElement}>
              <input type="hidden" name="id" value={item.id} />
              <Submit>Remove</Submit>
            </form>
          </div>
        );
      })}
    </div>
  );
};
