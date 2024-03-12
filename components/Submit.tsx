import { useFormStatus } from 'react-dom';
import { Button } from '@mui/material';
import React from 'react';

export const Submit: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { pending } = useFormStatus();

  return (
    <Button variant="contained" type="submit" disabled={pending}>
      {children}
    </Button>
  );
};
