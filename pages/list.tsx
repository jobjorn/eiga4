import React from 'react';
import { Box, Container, Paper, Typography } from '@material-ui/core';
import { NextPage } from 'next';
import Head from 'next/head';

const IndexPage: NextPage<{}> = ({}) => {
  return (
    <Container maxWidth="md">
      <Head>
        <title>NextJS Typescript Starter</title>
      </Head>
      <Box mt={6}>
        <Paper>
          <Box p={2}>
            <Typography variant={'h1'}>
              Eiga 4
            </Typography>
            <Typography variant={'subtitle1'}>List</Typography>
            <p>
              There will be a list here later
            </p>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default IndexPage;
