import { Typography } from '@mui/material';
import { PartnerForm } from 'components/PartnerForm';
import { getUserWithPartners } from './actions';

export default async function Page() {
  const userWithPartners = await getUserWithPartners();

  return (
    <>
      <Typography variant="h3">Översiktssida</Typography>
      <Typography variant="body1">
        Här ska man kunna se lite hur det går och ansluta till en partner/se vem
        man är ansluten till.
      </Typography>
      <PartnerForm user={userWithPartners} />
    </>
  );
}
