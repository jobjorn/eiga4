import { Card, CardActionArea, CardContent, Grid } from '@mui/material';
import { colors } from 'app/uicomponents/colors';
import { Duel } from 'types/types';

export const Duels: React.FC<{ duels: Duel[] }> = ({ duels }) => {
  return (
    <>
      <input type="hidden" name="left" value={duels[0].left.nameId} />
      <input type="hidden" name="right" value={duels[0].right.nameId} />
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid item xs={6}>
          <Card style={{ borderRadius: '30px', height: '100%' }}>
            <CardActionArea
              name="winner"
              value="left"
              type="submit"
              sx={{ height: '100%' }}
            >
              <CardContent
                sx={{
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.primary.main,
                  '&:hover': {
                    backgroundColor: colors.primary.light
                  }
                }}
              >
                {duels[0].left.name}
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card style={{ borderRadius: '30px', height: '100%' }}>
            <CardActionArea
              name="winner"
              value="right"
              type="submit"
              sx={{ height: '100%' }}
            >
              <CardContent
                sx={{
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.primary.main,
                  '&:hover': {
                    backgroundColor: colors.primary.light
                  }
                }}
              >
                {duels[0].right.name}
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};
