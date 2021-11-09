import React from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { query } from 'lib/db';
import { Menu } from 'components/Menu';
import { VotingBox } from 'components/VotingBox';

interface Props {
  fruits: Fruit[];
}

interface Fruit {
  id: number;
  fruit: string;
  position: number;
}

const IndexPage: NextPage<Props> = (props) => {
  const { fruits } = props;
  return (
    <Container maxWidth="md">
      <Head>
        <title>Eiga4</title>
      </Head>
      <Menu />
      <Box mt={6}>
        <Paper>
          <Box p={2}>
            <Typography variant={'h1'}>Eiga 4</Typography>
            <Typography variant={'subtitle1'}>Testing</Typography>
            <VotingBox fruits={fruits} />
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const result = await query(
    'SELECT id, fruit_name AS fruit, position FROM fruit_list ORDER BY RANDOM() LIMIT 2'
  );
  const { rows }: { rows: Fruit[] } = result;
  //console.log(result);
  return { props: { fruits: rows } };
};

export default IndexPage;
