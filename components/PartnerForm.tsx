'use client';

import { Alert, Avatar, Skeleton, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useFormState } from 'react-dom';
import { Submit } from './Submit';
import { Box, Stack } from '@mui/system';
import {
  addPartnership,
  cancelPartnership,
  invitationPartnership,
  severPartnership
} from 'app/overview/actions';
import { StatusMessage, UserWithPartners } from 'types/types';
import { PartnerBox } from './PartnerBox';

export const PartnerForm: React.FC<{ user: UserWithPartners | null }> = ({
  user
}) => {
  const [statusMessageAdd, formActionAdd] = useFormState(addPartnership, null);
  const [statusMessageCancel, formActionCancel] = useFormState(
    cancelPartnership,
    null
  );
  const [statusMessageInvitation, formActionInvitation] = useFormState(
    invitationPartnership,
    null
  );
  const [statusMessageSever, formActionSever] = useFormState(
    severPartnership,
    null
  );
  const formElement = useRef<HTMLFormElement>(null);

  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(
    null
  );

  useEffect(() => {
    let newStatusMessage;
    if (statusMessageAdd) {
      newStatusMessage = statusMessageAdd;
    } else if (statusMessageCancel) {
      newStatusMessage = statusMessageCancel;
    } else if (statusMessageInvitation) {
      newStatusMessage = statusMessageInvitation;
    } else if (statusMessageSever) {
      newStatusMessage = statusMessageSever;
    }

    setStatusMessage(newStatusMessage);
    if (newStatusMessage?.severity !== 'error' && formElement.current) {
      formElement.current.reset();
    }
  }, [
    statusMessageAdd,
    statusMessageCancel,
    statusMessageInvitation,
    statusMessageSever
  ]);

  /* säkerställ att de här verkligen funkar cachingmässigt */

  if (user === null) {
    return (
      <PartnerBox>
        <Skeleton style={{ flexGrow: 1 }} />
      </PartnerBox>
    );
  } else if (user?.partnering.length == 0 && user?.partnered.length == 0) {
    // Om användaren inte har någon definierad partner och inte heller någon inbjudan till att bli partnerad
    return (
      <form ref={formElement} action={formActionAdd}>
        <PartnerBox>
          <TextField
            style={{ flexGrow: 1 }}
            type="text"
            name="email"
            placeholder="E-postadress"
          />
          <Submit>Lägg till partner</Submit>
        </PartnerBox>
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
      <form ref={formElement} action={formActionCancel}>
        <PartnerBox>
          <p style={{ flexGrow: 1 }}>
            Du har skickat en inbjudan till{' '}
            <strong>
              {user.partnering[0].partneredEmail ||
                user.partnering[0].partnered?.email}
            </strong>{' '}
            att bli din partner.
          </p>
          <Submit>Avbryt</Submit>
        </PartnerBox>
        {statusMessage && (
          <Box mt={2}>
            <Alert severity={statusMessage.severity}>
              {statusMessage.message}
            </Alert>
          </Box>
        )}
      </form>
    );
  } else if (user.partnering.length == 0 && user.partnered.length > 0) {
    // Om användaren har en inbjudan som inte besvarats
    return (
      <form ref={formElement} action={formActionInvitation}>
        <PartnerBox>
          <p style={{ flexGrow: 1 }}>
            Du har en inbjudan från{' '}
            <strong>{user.partnered[0].partnering.email}</strong> som vill bli
            din partner.
          </p>
          <Submit name="invitation" value="accept">
            Acceptera
          </Submit>
          <Submit name="invitation" value="deny">
            Neka
          </Submit>
        </PartnerBox>
        {statusMessage && (
          <Box mt={2}>
            <Alert severity={statusMessage.severity}>
              {statusMessage.message}
            </Alert>
          </Box>
        )}
      </form>
    );
  } else if (user.partnering.length > 0 && user.partnered.length > 0) {
    // Om användaren har en partner
    return (
      <form ref={formElement} action={formActionSever}>
        <PartnerBox>
          <Box style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <p>Du är partner med</p>
            {user.partnering[0].partnered?.picture && (
              <Avatar
                src={user.partnering[0].partnered?.picture}
                sx={{ width: 24, height: 24, marginLeft: 1, marginRight: 0.5 }}
              />
            )}
            <p>
              <strong>{user.partnering[0].partnered?.name}</strong>.
            </p>
          </Box>
          <Submit>Avbryt partnerskap</Submit>
        </PartnerBox>

        {statusMessage && (
          <Box mt={2}>
            <Alert severity={statusMessage.severity}>
              {statusMessage.message}
            </Alert>
          </Box>
        )}
      </form>
    );
  } else {
    return <Box>Okänt fel</Box>;
  }
};
