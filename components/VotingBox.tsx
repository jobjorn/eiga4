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
import { getPivot, getTwoFruits } from 'services/local';
import { Fruit } from 'types/types';

export const VotingBox: React.FC<{}> = () => {
  const [loading, setLoading] = useState(true);
  const [fruits, setFruits] = useState<[Fruit, Fruit]>();
  // const [pivot, setPivot] = useState();

  const fetchTwoFruits = async () => {
    const twoFruits = await getTwoFruits();
    console.log('här kör vi setFruits');
    setFruits(twoFruits);
    console.log(fruits);
    setLoading(false);
  };
  /*
  const fetchPivot = async () => {
    const pivot = await getPivot();
    console.log('här ska det komma en pivot');
    console.log(pivot);
    setPivot(pivot);
  };
  */
  useEffect(() => {
    fetchTwoFruits();
    //fetchPivot();
  }, []);

  const router = useRouter();

  const createVote = (winner: number, loser: number) => {
    console.log('winner: ' + { winner });
    console.log('loser: ' + { loser });
    const defaultHeaders = {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8'
    };
    const url = '/api/vote';
    const options = {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({
        winner,
        loser,
        pivot: fruits[0].id
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
  console.log(fruits);
  return (
    <Box>
      <h2>May the best fruit win</h2>
      <h3>Next up: implementera faktisk quicksort-logik</h3>
      <Grid container spacing={1}>
        {loading ? (
          <Grid item xs={12}>
            laddar
          </Grid>
        ) : fruits[1] ? (
          <>
            <Grid item xs={6}>
              <Card>
                <CardActionArea
                  onClick={() => {
                    createVote(fruits[0].id, fruits[1].id);
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
                    createVote(fruits[1].id, fruits[0].id);
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
        ) : (
          <Grid item xs={12}>
            färdigröstat
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
