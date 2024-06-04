'use client';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Alert, Button, Link, Skeleton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useRef } from 'react';
import { useFormState } from 'react-dom';
import { startVoting } from 'app/names/actions';
import { UserWithPartners } from 'types/types';
import { PartnerBox } from './PartnerBox';
import { Submit } from './Submit';

export const VotingInvitation: React.FC<{
  user: UserWithPartners;
  hasPartner: boolean;
}> = ({ user, hasPartner }) => {
  const [statusMessage, formActionStartVote] = useFormState(startVoting, null);
  const formElement = useRef<HTMLFormElement>(null);

  if (user === null) {
    return (
      <PartnerBox>
        <Skeleton style={{ flexGrow: 1 }} />
      </PartnerBox>
    );
  }

  if (!hasPartner) {
    // Ingen partner -  bara att börja rösta
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
  } else {
    // Om det finns en partner
    if (
      user.readyToVote === false &&
      user.partnering[0].partnered?.readyToVote === true
    ) {
      // Om den inloggade användaren inte är redo att börja rösta, men partnern är.

      return (
        <form ref={formElement} action={formActionStartVote}>
          <Box
            sx={{
              display: 'flex',
              placeContent: 'end'
            }}
          >
            <Submit>
              {user.partnering[0].partnered.name} är redo att rösta, är du?
            </Submit>
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
    }
    // Om det finns en partner
    if (user.readyToVote === false) {
      // Om den inloggade användaren inte är redo att börja rösta, visa redo-knapp:

      return (
        <form ref={formElement} action={formActionStartVote}>
          <Box
            sx={{
              display: 'flex',
              placeContent: 'end'
            }}
          >
            <Submit>Redo att börja rösta</Submit>
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
    } else {
      // Om användaren är redo att rösta
      if (user.partnering[0].partnered?.readyToVote === false) {
        // Om partnern inte är redo att rösta
        return (
          <PartnerBox>
            <Typography variant="body1">
              Inväntar att {user.partnering[0].partnered?.name} blir redo att
              påbörja röstning.
            </Typography>
          </PartnerBox>
        );
      } else if (user.partnering[0].partnered?.readyToVote === true) {
        // Om partnern är redo att rösta
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
      } else {
        return <Box>Okänt fel</Box>;
      }
    }
  }
};
