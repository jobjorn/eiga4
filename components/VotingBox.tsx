import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Paper,
  styled,
  useTheme
} from '@mui/material';
import { FruitEmoji } from './FruitEmoji';
import { getTwoFruits } from 'services/local';

export interface Fruit {
  id: number;
  fruit: string;
  position: number;
}

export const VotingBox: React.FC<{}> = () => {
  const [loading, setLoading] = useState(true);
  const [fruits, setFruits] = useState<[Fruit, Fruit]>();

  const fetchTwoFruits = async () => {
    const twoFruits = await getTwoFruits();

    setFruits(twoFruits);
    setLoading(false);
  };
  useEffect(() => {
    fetchTwoFruits();
  }, []);

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
          fetchTwoFruits();
        } else {
          console.error(response.status);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const theme = useTheme();

  return (
    <Box>
      <h2>May the best fruit win</h2>
      <h3>Next up: implementera faktisk quicksort-logik</h3>
      <Grid container gap={theme.spacing(1)} wrap="nowrap">
        {loading ? (
          <Grid item xs={12}>
            laddar
          </Grid>
        ) : (
          <>
            <Grid item xs={6}>
              <Card>
                <CardActionArea
                  onClick={() => {
                    fruitVote(fruits[0].id);
                  }}
                >
                  <CardContent>
                    {fruits[0].fruit}
                    <FruitEmoji fruit={fruits[0].fruit} />
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card>
                <CardActionArea
                  onClick={() => {
                    fruitVote(fruits[1].id);
                  }}
                >
                  <CardContent>
                    {fruits[1].fruit}
                    <FruitEmoji fruit={fruits[1].fruit} />
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};
