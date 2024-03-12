'use client';

import { Alert, TextField } from '@mui/material';
import { useEffect, useRef } from 'react';
import { useFormState } from 'react-dom';
import { Submit } from './Submit';
import { Box } from '@mui/system';
import { addPartnership } from 'app/overview/actions';
import { UserWithPartners } from 'types/types';

export const PartnerForm: React.FC<{ user: UserWithPartners | null }> = ({
  user
}) => {
  const [statusMessage, formAction] = useFormState(addPartnership, null);
  const formElement = useRef<HTMLFormElement>(null);

  useEffect(() => {
    console.log('statusMessage', statusMessage);
    console.log('formElement', formElement);
    if (statusMessage?.severity !== 'error' && formElement.current) {
      formElement.current.reset();
    }
  }, [statusMessage]);

  console.log('partnering', user?.partnering);
  console.log('partnered', user?.partnered);

  if (
    user === null ||
    (user?.partnering.length == 0 && user?.partnered.length == 0)
  ) {
    // Om användaren inte har någon definierad partner och inte heller någon inbjudan till att bli partnerad
    return (
      <form
        ref={formElement}
        action={formAction}
        style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
      >
        <Box style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
          <TextField
            style={{ flexGrow: 1 }}
            type="text"
            name="email"
            placeholder="E-postadress"
          />
          <Submit>Lägg till partner</Submit>
        </Box>
        {statusMessage && (
          <Box mt={2}>
            <Alert severity={statusMessage.severity}>
              {statusMessage.message}
            </Alert>
          </Box>
        )}
      </form>
    );
  } else if (user.partnering.length > 0 && user.partnered.length == 0) {
    // Om användaren har skickat en inbjudan som ännu inte besvarats

    return (
      <Box>
        <p>
          Du har skickat en inbjudan till {user.partnering[0].partneredEmail}{' '}
          att bli din partner.
        </p>
      </Box>
    );
  } else if (user.partnering.length == 0 && user.partnered.length > 0) {
    // Om användaren har en inbjudan som inte besvarats
    return (
      <Box>
        <p>
          Du har en inbjudan från {user.partnered[0].partneringSub} att bli din
          partner.
        </p>
      </Box>
    );
  } else if (user.partnering.length > 0 && user.partnered.length > 0) {
    // Om användaren har en partner
    return (
      <Box>
        <p>Du är partner med {user.partnering[0].partneredSub}.</p>
      </Box>
    );
  } else {
    return <Box>Okänt fel</Box>;
  }
};
