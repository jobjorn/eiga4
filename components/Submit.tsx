import { useFormStatus } from 'react-dom';
/* import { Button } from '@mui/material'; */
import React from 'react';
import { Button } from 'styles/Button/Button';

export const Submit: React.FC<{
  children: React.ReactNode;
  name?;
  value?;
  disabled?: boolean;
}> = ({ children, name, value, disabled }) => {
  const { pending } = useFormStatus();

  return (
    <Button
      variant="contained"
      type="submit"
      disabled={pending || disabled}
      name={name}
      value={value}
    >
      {children}
    </Button>
  );
};
