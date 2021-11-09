import { useRouter } from 'next/router';
import React from 'react';
import { Box, Grid, Paper, styled } from '@mui/material';

interface Fruits {
  fruits: Fruit[];
}

interface Fruit {
  fruit: string;
}

const Emoji = (props) => (
  <span
    className="emoji"
    role="img"
    aria-label={props.label ? props.label : ''}
    aria-hidden={props.label ? 'false' : 'true'}
  >
    {props.symbol}
  </span>
);

export const FruitEmoji: React.FC<Fruit> = (fruit) => {
  const router = useRouter();

  let emoji = '🍕';

  if (fruit.fruit === 'apple') {
    emoji = '🍎';
  } else if (fruit.fruit === 'banana') {
    emoji = '🍌';
  } else if (fruit.fruit === 'dragon fruit') {
    emoji = '🐉';
  } else if (fruit.fruit === 'orange') {
    emoji = '🍊';
  } else if (fruit.fruit === 'peach') {
    emoji = '🍑';
  } else if (fruit.fruit === 'pear') {
    emoji = '🍐';
  } else if (fruit.fruit === 'pineapple') {
    emoji = '🍍';
  }

  return (
    <Box>
      <Emoji symbol={emoji} />
    </Box>
  );
};
