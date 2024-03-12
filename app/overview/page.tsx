'use client';
import { Button, TextField, Typography } from '@mui/material';
import { useRef } from 'react';

export default function Page() {
  const formElement = useRef<HTMLFormElement>(null);
  const addRelation = async (formData: FormData) => {
    console.log('addRelation', formData.get('email'));
  };

  return (
    <>
      <Typography variant="h3">Översiktssida</Typography>
      <Typography variant="body1">
        Här ska man kunna se lite hur det går och ansluta till en partner/se vem
        man är ansluten till.
      </Typography>
      <form
        ref={formElement}
        action={addRelation}
        style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
      >
        <TextField
          type="text"
          name="email"
          placeholder="partners email addres"
        />
        <Button variant="contained" type="submit">
          Add
        </Button>
      </form>
    </>
  );
}
