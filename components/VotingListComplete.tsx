import { Typography } from '@mui/material';
import { ListWithNames } from 'types/types';
import { NameBlob } from './VotingListInProgress';

export const VotingListComplete: React.FC<{
  sortedList: ListWithNames[];
}> = ({ sortedList }) => {
  return (
    <>
      <Typography variant="h3">Röstningen är slutförd</Typography>
      <ol>
        {sortedList.map((list) => (
          <li key={list.id} style={{ margin: '15px 0' }}>
            <NameBlob name={list.name} />
          </li>
        ))}
      </ol>
    </>
  );
};
