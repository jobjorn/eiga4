'use client';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Alert, Button, Link, Skeleton, Typography } from '@mui/material';
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

  /* 
  1. Kan man påbörja omröstning som ensam förälder?? 
  2. Ändra så att man inte längre är redo att rösta om man lägger till ett namn
  */

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
        <Box
          sx={{
            display: 'flex',
            placeContent: 'end'
          }}
        >
          <Submit>Start Voting!</Submit>
        </Box>

        {statusMessageStartVote && (
          <Box mt={2}>
            <Alert severity={statusMessageStartVote.severity}>
              {statusMessageStartVote.message}
            </Alert>
          </Box>
        )}
      </form>
    );
  } /* if (
    user.readyToVote &&
    user.partnering[0].partnered?.readyToVote === false
  ) */ else {
    // Om användaren är redo att rösta, men partnern inte är det

    return (
      <PartnerBox>
        <Typography variant="body1">
          Inväntar att {user.partnering[0].partnered?.name} blir redo att
          påbörja röstning.
        </Typography>
      </PartnerBox>
    );
  } /* else {
  /* else if (
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
  } */
  /*  else if (
    user.readyToVote === true &&
    user.partnering[0].partnered?.readyToVote === true
  ) {
    // Om användaren & partnern är redo att rösta
    return (
      <Button
        LinkComponent={Link}
        style={{ alignSelf: 'flex-end' }}
        href="/voting"
        size="large"
        variant="text"
        color="secondary"
        endIcon={<ArrowForwardIosIcon />}
      >
        Till omröstning
      </Button>
    );
  } 
  return <Box>Okänt fel</Box>;
} 
*/
};
