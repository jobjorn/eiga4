'use client';
import { Typography } from '@mui/material';
import React, { useRef } from 'react';
import { useFormState } from 'react-dom';
import { removeName } from 'app/actions';
import { theme } from 'styles/theme';
import { ListWithNames } from 'types/types';
import { Submit } from './Submit';

type NamesListProps = {
  list: ListWithNames[];
};
export const NamesList = (props: NamesListProps) => {
  const formElement = useRef<HTMLFormElement>(null);
  const [statusMessage, formAction] = useFormState(removeName, null);

  /*
  förslag: använd 1 form för hela listan och skicka med id:t
  i submit-knappen istället för som hidden input (submit name="remove" value={id})
  
  förslag2: nu syns in statusMessage någonstans - visa eller ta bort?

  förslag3: göra en liten komponent för namnen? då skulle man kunna slippa att ha
  dubbla returns, jag tycker att det är lite förvirrande
*/

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
