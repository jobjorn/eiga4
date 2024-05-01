import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { colors } from 'app/uicomponents/colors';
import { InProgressList, ListWithNames } from 'types/types';

export const VotingListInProgress: React.FC<{
  inProgressList: InProgressList[];
  list: ListWithNames[];
}> = ({ inProgressList, list }) => {
  const maxPosition = Math.max(...inProgressList.map((list) => list.position));

  const [combinedList, setCombinedList] = useState<InProgressList[]>([]);
  const [listItems, setListItems] = useState<JSX.Element[]>([]);

  useEffect(() => {
    let newCombinedList = inProgressList;

    list.map((item) => {
      if (
        !inProgressList.some(
          (inProgressItem) => inProgressItem.name === item.name.name
        )
      ) {
        newCombinedList.push({
          name: item.name.name,
          position: 0,
          id: item.nameId
        });
      }
    });

    setCombinedList(newCombinedList);
  }, [inProgressList, list]);

  useEffect(() => {
    let newListItems: JSX.Element[] = [];
    for (let i = 0; i <= maxPosition; i++) {
      const items = inProgressList
        .filter((item) => item.position === i)
        .map((item) => {
          return <NameBlob key={item.id} name={item.name} />;
        });
      newListItems.push(
        <li key={i} style={{ margin: '15px 0' }}>
          {items}
        </li>
      );
    }

    setListItems(newListItems);
  }, [combinedList]);

  return (
    <>
      <Typography variant="h3">Listan hittills</Typography>
      <ol>{listItems}</ol>
    </>
  );
};

export const NameBlob: React.FC<{ name: string }> = ({ name }) => {
  return (
    <span
      style={{
        backgroundColor: colors.secondary.light,
        padding: '5px',
        borderRadius: '5px',
        margin: '5px'
      }}
    >
      {name}
    </span>
  );
};
