import { Typography } from '@mui/material';
import { getNameList } from 'app/actions';
import { colors } from 'app/uicomponents/colors';
import { NamesForm } from 'components/NamesForm';
import { VotingInvitation } from 'components/VotingInvitation';
import { ListWithNames } from 'types/types';

export default async function Page() {
  const list: ListWithNames[] = await getNameList();
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant="h3">Namn</Typography>
        <VotingInvitation />
      </div>
      <NamesForm list={list} />
    </div>
  );
}
