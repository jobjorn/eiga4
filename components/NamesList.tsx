'use client';
import React, { useRef } from 'react';
import { Typography } from '@mui/material';
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
  /*
  förslag: använd 1 form för hela listan och skicka med id:t
  i submit-knappen istället för som hidden input (submit name="remove" value={id})
  
  förslag2: nu syns in statusMessage någonstans - visa eller ta bort?

  förslag3: göra en liten komponent för namnen? då skulle man kunna slippa att ha
  dubbla returns, jag tycker att det är lite förvirrande
*/

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
        gap: '5px'
      }}
    >
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
            <div style={{ display: 'flex', gap: '5px' }}>
              <img
                src={item.avatar}
                style={{ width: '20px', height: '20px', borderRadius: '50%' }}
              />
              <Typography variant="body1">{item.name}</Typography>
            </div>
            <form action={formAction} ref={formElement}>
              <input type="hidden" name="id" value={item.id} />
              <Submit variant="text">
                <AiOutlineClose />
              </Submit>
            </form>
          </div>
        );
      })}
    </div>
  );
};
