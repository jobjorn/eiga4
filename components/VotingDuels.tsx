import { Card, CardActionArea, CardContent, Grid } from '@mui/material';
import { colors } from 'app/uicomponents/colors';
import { Duel } from 'types/types';

export const Duels: React.FC<{ duels: Duel[] }> = ({ duels }) => {
  return (
    <>
      <input type="hidden" name="left" value={duels[0].left.nameId} />
      <input type="hidden" name="right" value={duels[0].right.nameId} />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Card style={{ borderRadius: '30px' }}>
            <CardActionArea name="winner" value="left" type="submit">
              <CardContent
                sx={{
                  aspectRatio: '1/1',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.secondary.light,
                  fontSize: '2em'
                }}
              >
                {duels[0].left.name.name}
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card style={{ borderRadius: '30px' }}>
            <CardActionArea name="winner" value="right" type="submit">
              <CardContent
                sx={{
                  aspectRatio: '1/1',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.secondary.light,
                  fontSize: '2em'
                }}
              >
                {duels[0].right.name.name}
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};
