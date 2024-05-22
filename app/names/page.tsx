import { Typography } from '@mui/material';
import { getNameList } from 'app/actions';
import { getUserWithPartners } from 'app/overview/actions';
import { NamesForm } from 'components/NamesForm';
import { VotingInvitation } from 'components/VotingInvitation';
import { ListWithNames } from 'types/types';

export default async function Page() {
  const list: ListWithNames[] = await getNameList();
  const userWithPartners = await getUserWithPartners();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}
    >
      <Typography variant="h3">Namn</Typography>
      <NamesForm list={list} />
      <VotingInvitation user={userWithPartners} />
    </div>
  );
}
