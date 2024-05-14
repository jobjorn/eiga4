import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, Button, Typography } from '@mui/material';
import { PageTitle } from 'app/uicomponents/PageTitle';
import { PartnerForm } from 'components/PartnerForm';
import { getUserWithPartners } from './actions';

export default async function Page() {
  const userWithPartners = await getUserWithPartners();

  return (
    <>
      <Box style={{ flexGrow: 1 }}>
        <PageTitle>1. Partner</PageTitle>
        <Typography variant="body1">
          Det första steget i Namnväljarprocessen är att bjuda in en partner som
          delar namnlistor och resultat med dig. Om du vill kan du hoppa över
          det här steget och köra själv.
        </Typography>
        <PartnerForm user={userWithPartners} />
      </Box>
      <Button
        style={{ alignSelf: 'flex-end' }}
        href="/names"
        size="large"
        variant="text"
        color="secondary"
        endIcon={<ArrowForwardIosIcon />}
      >
        Börja lägga till namn
      </Button>
    </>
  );
}
