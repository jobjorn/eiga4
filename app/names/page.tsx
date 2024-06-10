import { Box, Skeleton } from '@mui/material';
import { getUserWithPartners } from 'app/overview/actions';
import { PageTitle } from 'app/uicomponents/PageTitle';
import { NamesForm } from 'components/NamesForm';
import { VotingInvitation } from 'components/VotingInvitation';
import { ListWithNames, UserWithPartners } from 'types/types';
import { getNameList } from './actions';

export default async function Page() {
  const list: ListWithNames[] = await getNameList();
  const user: UserWithPartners | null = await getUserWithPartners();

  let hasPartner = false;

  if (!user) {
    return <Skeleton style={{ flexGrow: 1 }} />;
  } else if (user.partnering.length > 0 && user.partnered.length > 0) {
    // Om användaren har en partner
    hasPartner = true;
  }

  return (
    <>
      <Box style={{ flexGrow: 1 }}>
        <PageTitle>2. Namn</PageTitle>
        <NamesForm user={user} list={list} hasPartner={hasPartner} />
      </Box>
      <VotingInvitation user={user} hasPartner={hasPartner} />
    </>
  );
}
