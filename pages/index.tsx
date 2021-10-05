import React from 'react';
import { Box, Container, Paper, Typography } from '@material-ui/core';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import {query} from 'lib/db';

interface Props {
  test: Fruit[];
}

interface Fruit {
  id: number;
  fruit: string;
  position: number;
}

const IndexPage: NextPage<Props> = (props) => {
  const { test } = props;
  return (
    <Container maxWidth="md">
      <Head>
        <title>NextJS Typescript Starter</title>
      </Head>
      <Box mt={6}>
        <Paper>
          <Box p={2}>
            <Typography variant={'h1'}>Eiga 4</Typography>
            <Typography variant={'subtitle1'}>Testing</Typography>
            <pre>{JSON.stringify(test, null, 2)}</pre>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const result = await query('SELECT id, fruit_name AS fruit, position FROM fruit_list');
  const { rows }: { rows: Fruit[] } = result;
  console.log(result);
  return { props: { test: rows } };
};

export default IndexPage;
