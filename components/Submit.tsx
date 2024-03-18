import { useFormStatus } from 'react-dom';
import { Button } from '@mui/material';
import React from 'react';

export const Submit: React.FC<{ children: React.ReactNode; name?; value? }> = ({
  children,
  name,
  value
}) => {
  const { pending } = useFormStatus();

  return (
    <Button
      variant="contained"
      type="submit"
      disabled={pending}
      name={name}
      value={value}
    >
      {children}
    </Button>
  );
};
