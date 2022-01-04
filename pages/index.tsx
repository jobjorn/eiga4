import React from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import { NextPage } from 'next';
import Head from 'next/head';
import { Menu } from 'components/Menu';
import { VotingBox } from 'components/VotingBox';

const IndexPage: NextPage<{}> = () => {
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
            <VotingBox />
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default IndexPage;
