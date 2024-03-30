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
          Olika färger beroende på vem som lagt till namnet (du, din partner,
          båda)?
        </li>
        <li>Ett kryss istället för "Remove knappen"</li>
        <li>Mer kompakt, kolumner (beroende på sidans bredd) (css columns)</li>
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
