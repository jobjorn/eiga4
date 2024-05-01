import { Button } from '@mui/material';
import React from 'react';
import { useFormStatus } from 'react-dom';

export const Submit: React.FC<{
  children: React.ReactNode;
  name?;
  value?;
  disabled?: boolean;
  color?;
}> = ({ children, name, value, disabled, color }) => {
  const { pending } = useFormStatus();

  return (
    <Button
      variant="contained"
      type="submit"
      disabled={pending || disabled}
      name={name}
      value={value}
      color={color}
    >
      {children}
    </Button>
  );
};
