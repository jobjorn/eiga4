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
              Opinionated NextJS Typescript starter
            </Typography>
            <Typography variant={'subtitle1'}>With Material-UI</Typography>
            <p>
              This is my preferred starter template for building NextJS apps in
              Typescript. This version also includes{' '}
              <a href="https://material-ui.com/">Material UI</a> for quicker
              prototyping.
            </p>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default IndexPage;
