import { Typography } from '@mui/material';
import { getList } from 'app/actions';
import { NamesForm } from 'components/NamesForm';
import { NamesList } from 'components/NamesList';

export default async function Page() {
  const list = await getList();
  return (
    <>
      <Typography variant="h3">Namn</Typography>
      <Typography variant="body1">
        Här ska man kunna se vilka namn som är tillagda och även kunna lägga
        till nya, ta bort gamla, klicka på namn för att se mer information.
      </Typography>
      <Typography variant="body1">
        Kanske någon slags små kort snarare än en lista? Olika färger beroende
        på vem som lagt till namnet (du, din partner, båda)?
      </Typography>

      <Typography variant="body1">
        Måste också säkerställa att listan verkligen uppdateras direkt när man
        skrivit in ett nytt namn.
      </Typography>
      <NamesList list={list} />
      <NamesForm />
    </>
  );
}
