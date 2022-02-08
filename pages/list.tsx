import React from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import { NextPage } from 'next';
import Head from 'next/head';
import { Menu } from 'components/Menu';
import { List } from 'components/List';

const IndexPage: NextPage<{}> = ({}) => {
  return (
    <Container maxWidth="md">
      <Head>
        <title>Eiga 4</title>
      </Head>
      <Menu />
      <Box mt={6}>
        <Paper>
          <Box p={2}>
            <Typography variant={'h1'}>Eiga 4</Typography>
            <Typography variant={'subtitle1'}>List</Typography>
            <List />
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default IndexPage;
