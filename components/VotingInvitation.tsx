'use client';
import { Alert, Button, Skeleton } from '@mui/material';
import { Box } from '@mui/system';
import { useRef } from 'react';
import { useFormState } from 'react-dom';
import { startVoting } from 'app/names/action';
import { UserWithPartners } from 'types/types';
import { PartnerBox } from './PartnerBox';
import { Submit } from './Submit';

export const VotingInvitation: React.FC<{
  user: UserWithPartners;
}> = ({ user }) => {
  const [statusMessageStartVote, formActionStartVote] = useFormState(
    startVoting,
    null
  );

  /* Kan man påbörja omröstning som ensam förälder?? */

  const formElement = useRef<HTMLFormElement>(null);
  if (user === null) {
    return (
      <PartnerBox>
        <Skeleton style={{ flexGrow: 1 }} />
      </PartnerBox>
    );
  } else if (user.readyToVote === false && user?.partnered.length === 0) {
    // Om användaren inte har någon definierad partner och inte heller någon inbjudan till att bli partnerad
    return (
      <form ref={formElement} action={formActionStartVote}>
        <PartnerBox>
          <Submit>Start Voting!</Submit>
        </PartnerBox>
        {statusMessageStartVote && (
          <Box mt={2}>
            <Alert severity={statusMessageStartVote.severity}>
              {statusMessageStartVote.message}
            </Alert>
          </Box>
        )}
      </form>
    );
  } else if (
    user.readyToVote &&
    user.partnering[0].partnered?.readyToVote === false
  ) {
    // Om användaren är redo att rösta, men partnern inte är det

    return (
      <PartnerBox>
        <p style={{ flexGrow: 1 }}>
          Inväntar att {user.partnering[0].partnered?.name} blir redo att
          påbörja röstning.
        </p>
      </PartnerBox>
    );
  } else if (
    user.readyToVote === false &&
    user.partnering[0].partnered?.readyToVote === true
  ) {
    // Om användarens partner är redo att rösta men inte användaren själv
    return (
      <form ref={formElement} action={formActionStartVote}>
        <PartnerBox>
          <p style={{ flexGrow: 1 }}>
            {user.partnered[0].partnering.name} är redo att rösta, är du?
          </p>
          <Submit>Ja</Submit>
        </PartnerBox>
        {statusMessageStartVote && (
          <Box mt={2}>
            <Alert severity={statusMessageStartVote.severity}>
              {statusMessageStartVote.message}
            </Alert>
          </Box>
        )}
      </form>
    );
  } else if (
    user.readyToVote === false &&
    user.partnering[0].partnered?.readyToVote === true
  ) {
    // Om användaren & partnern är redo att rösta
    return (
      <PartnerBox>
        <Box style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <p>Alla är redo att rösta, nu drar vi igång!</p>
        </Box>
        <Button
          variant="contained"
          onClick={() => {
            /*  handleOpenCancelModal(); */
          }}
        >
          Till omröstningen!
        </Button>
      </PartnerBox>
    );
  } else {
    return <Box>Okänt fel</Box>;
  }
};
