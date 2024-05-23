import { Box } from '@mui/material';
import { getNameList } from 'app/actions';
import { getUserWithPartners } from 'app/overview/actions';
import { PageTitle } from 'app/uicomponents/PageTitle';
import { NamesForm } from 'components/NamesForm';
import { VotingInvitation } from 'components/VotingInvitation';
import { ListWithNames } from 'types/types';

export default async function Page() {
  const list: ListWithNames[] = await getNameList();
  const userWithPartners = await getUserWithPartners();

  return (
    <>
      <Box style={{ flexGrow: 1 }}>
        <PageTitle>2. Namn</PageTitle>
        <NamesForm list={list} />
      </Box>
      <VotingInvitation user={userWithPartners} />
    </>
  );
}
