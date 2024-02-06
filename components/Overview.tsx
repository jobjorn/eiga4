import React, { useState, useRef } from 'react';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { addNames } from 'app/actions';
import { getSession } from '@auth0/nextjs-auth0';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});

export const Overview: React.FC<{}> = async () => {
  const session = await getSession();
  const user = session?.user ?? null;
  if (!user) {
    return null;
  }

  const addNamesWithId = addNames.bind(null, user.sub);

  const list = await prisma.list.findMany({
    where: {
      userSub: user.sub
    },
    include: {
      name: true
    },
    orderBy: {
      name: {
        name: 'asc'
      }
    }
  });

  return (
    <>
      <Typography variant="h1">Översikt</Typography>

      <Typography variant="h2">Namn</Typography>
      {list.map((item) => {
        return (
          <div key={item.id}>
            <Typography variant="body1">{item.name.name}</Typography>
          </div>
        );
      })}
      <Typography variant="h2">Lägg till nya namn</Typography>
      <form action={addNamesWithId}>
        <Stack spacing={2}>
          <TextField label="Namn" name="names" multiline minRows={3} />
        </Stack>
        <Button variant="contained" type="submit">
          Lägg till
        </Button>
      </form>
    </>
  );
};
