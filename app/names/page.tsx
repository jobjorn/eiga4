import { Typography } from '@mui/material';
import { getList } from 'app/actions';
import { NamesForm } from 'components/NamesForm';
import { ListWithNames } from 'types/types';

export default async function Page() {
  const list: ListWithNames[] = await getList();
  return (
    <>
      <ul>
        <li>
          <s>Se lista på namn</s>
        </li>
        <li>
          <s>Lägg till namn</s>
        </li>
        <li>
          <s>Ta bort namn</s>
        </li>
        <li>optimistic update -lägga till namn - ta bort namn</li>
        <li>
          Olika färger beroende på vem som lagt till namnet (du, din partner,
          båda)?
        </li>
      </ul>
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
    </>
  );
}
