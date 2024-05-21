import { Box, Typography } from '@mui/material';
import { getNameList, getVotes } from 'app/actions';
import { PageTitle } from 'app/uicomponents/PageTitle';
import { VotingListComplete } from 'components/VotingListComplete';

export default async function Page() {
  const list = await getNameList();
  const votes = await getVotes();

  return (
    <>
      <Box style={{ flexGrow: 1 }}>
        <PageTitle>4. Resultat</PageTitle>
        <Typography variant="body1">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Typography>
        <VotingListComplete list={list} votes={votes} />
      </Box>
    </>
  );
}
