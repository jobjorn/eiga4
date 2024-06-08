import { Typography } from '@mui/material';
import Link from 'next/link';
import { PageTitle } from 'app/uicomponents/PageTitle';

export default async function Page() {
  return (
    <>
      <PageTitle>Om Namnväljaren</PageTitle>
      <Typography sx={{ marginY: 1 }} variant="body1">
        Namnväljaren är ett verktyg för att underlätta namnval. Du kan lägga in
        namnförslag, rangordna dem med hjälp av en sorteringsalgoritm och se
        resultatet.
      </Typography>
      <Typography sx={{ marginY: 1 }} variant="body1">
        Namnväljaren har byggts av{' '}
        <Link href="https://www.mejstedt.se">Hedvig Mejstedt</Link> och{' '}
        <Link href="https://www.jobjorn.se/">Jobjörn Folkesson</Link>. En
        tidigare prototyp användes för att välja namn till vårt första barn, den
        här versionen för att välja namn till vårt andra.
      </Typography>
    </>
  );
}
