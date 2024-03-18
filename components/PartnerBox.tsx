import { Stack, useTheme } from '@mui/system';

export const PartnerBox: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  return (
    <Stack
      direction="row"
      style={{
        backgroundColor: '#DAEDEA',
        padding: 20,
        borderRadius: 20,
        alignItems: 'center'
      }}
      spacing={2}
    >
      {children}
    </Stack>
  );
};
