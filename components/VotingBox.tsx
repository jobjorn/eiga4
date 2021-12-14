import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, styled } from '@mui/material';
import { FruitEmoji } from './FruitEmoji';
import { getTwoFruits } from 'services/local';

interface Fruits {
  fruits: Fruit[];
}

export interface Fruit {
  id: number;
  fruit: string;
  position: number;
}

export const VotingBox: React.FC<Fruits> = (props) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataAsync = async () => {
      const twoFruits = await getTwoFruits();
      console.log('visa mig frukterna!!');
      console.log(twoFruits);
      setLoading(false);
    };
    fetchDataAsync();
  }, []);

  const fruit0 = props.fruits[0];
  const fruit1 = props.fruits[1];
  const router = useRouter();

  const fruitVote = (fruitId: number) => {
    console.log(fruitId);
    const defaultHeaders = {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8'
    };
    const url = '/api/vote';
    const options = {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({
        fruitId
      })
    };
    fetch(url, options)
      .then((response) => {
        if (response.status === 200) {
          // refresh
        } else {
          console.error(response.status);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Box>
      <h2>Herp</h2>
      <Grid container>
        <Grid item xs={6}>
          <button
            onClick={() => {
              fruitVote(fruit0.id);
            }}
          >
            {fruit0.fruit}
            <FruitEmoji fruit={fruit0.fruit} />
          </button>
        </Grid>
        <Grid item xs={6}>
          {fruit1.fruit}
          <FruitEmoji fruit={fruit1.fruit} />
        </Grid>
      </Grid>
    </Box>
  );
};
