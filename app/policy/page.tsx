import { Typography } from '@mui/material';
import Link from 'next/link';
import { PageTitle } from 'app/uicomponents/PageTitle';

export default async function Page() {
  return (
    <>
      <PageTitle>Integritets- och cookiepolicy</PageTitle>
      <Typography variant="body1">
        Namnväljaren är ett verktyg för att underlätta namnval. Du kan lägga in
        namnförslag, rangordna dem med hjälp av en sorteringsalgoritm och se
        resultatet.
      </Typography>
      <Typography sx={{ marginY: 1 }} variant="body1">
        Skyddet av dina personuppgifter och din personlig data är viktigt för
        oss. I denna integritets- och cookiepolicy beskrivs hur dina
        personuppgifter och din personliga data behandlas när du använder dig av
        webbapplikationen Namnväljaren. Denna policy uppdaterades senast den 28
        maj 2024.
      </Typography>
      <Typography sx={{ marginY: 1 }} variant="h5">
        Personuppgiftsansvar
      </Typography>

      <Typography sx={{ marginY: 1 }} variant="body1">
        Jobjörn Folkesson är personuppgiftsansvarig för den behandling av
        personuppgifter som sker i samband med användning av Namnväljaren. Du
        kan kontakta oss på{' '}
        <Link href="mailto:jobjorn@jobjorn.se">jobjorn@jobjorn.se</Link>.
      </Typography>

      <Typography sx={{ marginY: 1 }} variant="h5">
        Vilken information samlar vi in?
      </Typography>

      <Typography sx={{ marginY: 1 }} variant="body1">
        När du använder Namnväljaren samlar vi in information om dig. Detta är
        namn, e-postadress, visningsnamn, profilbild, vissa unika identifierare
        kopplade till din inloggning, samt de uppgifter du själv väljer att
        lämna i samband med användning av Namnväljaren (till exempel namnen du
        lägger till och andra användare du ansluter till).
      </Typography>

      <Typography sx={{ marginY: 1 }} variant="h5">
        Cookies
      </Typography>

      <Typography sx={{ marginY: 1 }} variant="body1">
        För att kunna använda Namnväljaren måste din webbläsare tillåta cookies.
        Enligt lagen om elektronisk kommunikation och dess förändringar skall
        alla som besöker en webbplats med cookies få information om detta.
        Cookies är små textfiler som sparas på din dator och innehåller
        information som Namnväljaren behöver för att kunna vara säker på vem du
        är under tiden du är inloggad. De enda cookies som lagras är de som är
        nödvändiga för att webbplatsen ska fungera och av detta skäl går det
        inte att välja bort cookies.
      </Typography>

      <Typography sx={{ marginY: 1 }} variant="h5">
        Personuppgiftsbiträde
      </Typography>

      <Typography sx={{ marginY: 1 }} variant="body1">
        För att kunna erbjuda Namnväljaren använder vi oss av en extern
        leverantör för hantering av användaridentiter, Okta, genom deras tjänst
        Auth0. Denna leverantör i sin roll som personuppgiftsbiträde tillgång
        till de personuppgifter som samlas in i samband med användning av
        Namnväljaren. Dessa uppgifter behandlas i enlighet med deras
        integritetspolicy, som du kan läsa mer om på{' '}
        <Link href="https://auth0.com/privacy">https://auth0.com/privacy</Link>.
      </Typography>

      <Typography sx={{ marginY: 1 }} variant="h5">
        Hur länge sparas dina uppgifter?
      </Typography>

      <Typography sx={{ marginY: 1 }} variant="body1">
        Dina personuppgifter sparas så länge du har ett konto på Namnväljaren.
        Du kan begära att personuppgifter raderas genom att kontakta oss på{' '}
        <Link href="mailto:jobjorn@jobjorn.se">jobjorn@jobjorn.se</Link>.
      </Typography>

      <Typography sx={{ marginY: 1 }} variant="h5">
        Ändringar i policyn
      </Typography>

      <Typography sx={{ marginY: 1 }} variant="body1">
        Vi förbehåller oss rätten att ändra denna policy genom att publicera den
        nya, reviderade, policyn på webbplatsen. Om ändringarna är väsentliga
        kommer du att informeras om detta.
      </Typography>
    </>
  );
}
