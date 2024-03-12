import React, { useRef } from 'react';
import { Typography } from '@mui/material';
import { getList } from 'app/actions';

export const NamesList: React.FC<{}> = async () => {
  const list = await getList();

  return (
    <ul>
      {list.map((item) => {
        return (
          <li key={item.id}>
            <Typography variant="body1">{item.name.name}</Typography>
          </li>
        );
      })}
    </ul>
  );
};
