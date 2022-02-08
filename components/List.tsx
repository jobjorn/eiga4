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
import { getList } from 'services/local';
import { Fruit } from 'types/types';

export const List: React.FC<{}> = () => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<Fruit[]>();

  const fetchList = async () => {
    const list: Fruit[] = await getList();
    console.log('här kör vi setList');
    setList(list);
    console.log(list);
    setLoading(false);
  };

  useEffect(() => {
    fetchList();
  }, []);

  const router = useRouter();

  const theme = useTheme();
  console.log(list);
  return (
    <Box>
      <Grid container spacing={1}>
        {loading ? (
          <Grid item xs={12}>
            laddar
          </Grid>
        ) : (
          <Grid item xs={12}>
            <ol>
              {list.map((item: Fruit, index) => (
                <li key={index}>
                  {item.fruit} <FruitEmoji fruit={item.fruit} />
                </li>
              ))}
            </ol>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
