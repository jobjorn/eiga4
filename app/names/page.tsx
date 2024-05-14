import { Typography } from '@mui/material';
import { getNameList } from 'app/actions';
import { NamesForm } from 'components/NamesForm';
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
      <Typography variant="h3">Namn</Typography>
      <NamesForm list={list} />
    </div>
  );
}
