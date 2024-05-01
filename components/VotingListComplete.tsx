import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { colors } from 'app/uicomponents/colors';
import { InProgressList, ListWithNames } from 'types/types';
import { NameBlob } from './VotingListInProgress';

export const VotingListComplete: React.FC<{
  sortedList: ListWithNames[];
}> = ({ sortedList }) => {
  return (
    <>
      <Typography variant="h3">Röstningen är slutförd</Typography>
      <ol>
        {sortedList.map((list) => (
          <li key={list.nameId} style={{ margin: '15px 0' }}>
            <NameBlob name={list.name.name} />
          </li>
        ))}
      </ol>
    </>
  );
};
