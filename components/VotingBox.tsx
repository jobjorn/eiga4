import { useRouter } from 'next/router';
import React from 'react';
import { Box, Grid, Paper, styled } from '@mui/material';
import { FruitEmoji } from './FruitEmoji';

interface Fruits {
  fruits: Fruit[];
}

interface Fruit {
  id: number;
  fruit: string;
  position: number;
}

export const VotingBox: React.FC<Fruits> = (props) => {
  const router = useRouter();
  return (
    <Box>
      <h2>Herp</h2>
      <Grid container>
        <Grid item xs={6}>
          {props.fruits[0].fruit}
          <FruitEmoji fruit={props.fruits[0].fruit} />
        </Grid>
        <Grid item xs={6}>
          {props.fruits[1].fruit}
          <FruitEmoji fruit={props.fruits[1].fruit} />
        </Grid>
      </Grid>
    </Box>
  );
};
