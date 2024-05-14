import { Button } from '@mui/material';
import React from 'react';
import { useFormStatus } from 'react-dom';

export const Submit: React.FC<{
  children: React.ReactNode;
  name?: string;
  value?: string | number;
  disabled?: boolean;
  color?:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning'
    | undefined;
  variant?: 'text' | 'outlined' | 'contained';
}> = ({ children, name, value, disabled, color, variant = 'contained' }) => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending || disabled}
      name={name}
      value={value}
      color={color}
      variant={variant}
    >
      {children}
    </Button>
  );
};
