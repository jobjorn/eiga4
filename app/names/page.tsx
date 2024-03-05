import { Typography } from '@mui/material';
import { NamesForm } from 'components/NamesForm';
import { NamesList } from 'components/NamesList';

export default async function Page() {
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
      <NamesList />
      <NamesForm />
    </>
  );
}
