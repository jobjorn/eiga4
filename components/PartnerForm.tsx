'use client';

import {
  Alert,
  Avatar,
  Button,
  Modal,
  Skeleton,
  TextField,
  Typography
} from '@mui/material';
import { Box, Stack } from '@mui/system';
import { useEffect, useRef, useState } from 'react';
import { useFormState } from 'react-dom';
import {
  addPartnership,
  cancelPartnership,
  invitationPartnership,
  severPartnership
} from 'app/overview/actions';
import { colors } from 'app/uicomponents/colors';
import { StatusMessage, UserWithPartners } from 'types/types';
import { PartnerBox } from './PartnerBox';
import { Submit } from './Submit';

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
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(
    null
  );

  const [cancelModalOpen, setCancelModalOpen] = useState<boolean>(false);
  const handleCloseCancelModal = () => {
    setCancelModalOpen(false);
  };
  const handleOpenCancelModal = () => {
    setCancelModalOpen(true);
  };

  const formElement = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const statusMessages = [
      statusMessageAdd,
      statusMessageCancel,
      statusMessageInvitation,
      statusMessageSever
    ];

    let latestStatusMessage: StatusMessage[] = [];
    let latestTimestamp = 0;

    statusMessages.forEach((message) => {
      if (message && message.timestamp > latestTimestamp) {
        latestStatusMessage[0] = message;
        latestTimestamp = message.timestamp;
      }
    });

    if (latestStatusMessage.length > 0) {
      setStatusMessage(latestStatusMessage[0]);
      if (latestStatusMessage[0]?.severity !== 'error' && formElement.current) {
        formElement.current.reset();
      }
    }

    handleCloseCancelModal();
  }, [
    statusMessageAdd,
    statusMessageCancel,
    statusMessageInvitation,
    statusMessageSever
  ]);

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
            Vill du bli partner med{' '}
            <strong>{user.partnered[0].partnering.email}</strong>?
          </p>
          <Submit name="invitation" value="accept">
            Ja
          </Submit>
          <Submit name="invitation" value="deny">
            Nej
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
      <>
        <Modal
          open={cancelModalOpen}
          onClose={handleCloseCancelModal}
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box
            style={{
              borderRadius: '25px',
              padding: '25px',
              backgroundColor: colors.error.light
            }}
          >
            <form ref={formElement} action={formActionSever}>
              <Typography variant="h4">Avbryta partnerskap?</Typography>
              <Typography variant="body1" sx={{ paddingBottom: 1 }}>
                Om du går vidare raderas partnerskapet för båda parter.
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                style={{ justifyContent: 'right' }}
              >
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleCloseCancelModal}
                >
                  Nej, avvakta
                </Button>
                <Submit color="error">Ja, avsluta</Submit>
              </Stack>
            </form>
          </Box>
        </Modal>
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
          <Button
            variant="contained"
            onClick={() => {
              handleOpenCancelModal();
            }}
          >
            Avsluta partnerskap
          </Button>
        </PartnerBox>

        {statusMessage && (
          <Box mt={2}>
            <Alert severity={statusMessage.severity}>
              {statusMessage.message}
            </Alert>
          </Box>
        )}
      </>
    );
  } else {
    return <Box>Okänt fel</Box>;
  }
};
