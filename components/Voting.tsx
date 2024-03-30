'use client';

import { Vote } from '@prisma/client';

import {
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { useRef, useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useUser } from '@auth0/nextjs-auth0/client';
import { addVote } from 'app/actions';
import { ListWithNames } from 'types/types';
import { colors } from 'app/uicomponents/colors';

type Duel = {
  left: ListWithNames;
  right: ListWithNames;
};

type InProgressList = {
  name: string;
  position: number;
  id: number;
};

export const Voting: React.FC<{ list: ListWithNames[]; votes: Vote[] }> = ({
  list,
  votes
}) => {
  const [duels, setDuels] = useState<Duel[]>([]);
  const [sortedList, setSortedList] = useState<ListWithNames[]>([]);
  const [isFinallyMerged, setIsFinallyMerged] = useState(false);
  const [inProgressList, setInProgressList] = useState<InProgressList[]>([]);

  // Recursive function to perform merge sort on an array of ListWithNames
  const mergeSort = (list: ListWithNames[]): ListWithNames[] => {
    //   console.log('initierar en mergeSort', list.length);

    // Base case: if the array has 1 or 0 elements, it is already sorted
    if (list.length <= 1) {
      return list;
    }

    // Find the middle index of the array
    const mid = Math.floor(list.length / 2);

    // Split the array into two halves: left and right
    const left = list.slice(0, mid);
    const right = list.slice(mid);

    // Recursively call mergeSort on the left and right halves
    return merge(mergeSort(left), mergeSort(right));
  };

  // Function to merge two sorted arrays into a single sorted array
  const merge = (
    left: ListWithNames[],
    right: ListWithNames[]
  ): ListWithNames[] => {
    // Initialize an empty array to store the merged result
    let result: ListWithNames[] = [];

    // Initialize two pointers, i and j, to track the indices of the left and right arrays
    let i = 0;
    let j = 0;

    // Compare the elements of the left and right arrays and merge them in sorted order
    while (i < left.length && j < right.length) {
      const isLeftWinner = votes.find(
        (vote) =>
          vote.winnerId === left[i].nameId && vote.loserId === right[j].nameId
      );
      const isRightWinner = votes.find(
        (vote) =>
          vote.winnerId === right[j].nameId && vote.loserId === left[i].nameId
      );
      // Compare the number of votes for the current lists and push the list with more votes to the result array
      if (isLeftWinner) {
        result.push(left[i]);
        i++;
      } else if (isRightWinner) {
        result.push(right[j]);
        j++;
      } else {
        setDuels((prev) => [
          ...prev,
          {
            left: left[i],
            right: right[j]
          }
        ]);
        return [];
      }
    }

    // If there are any remaining elements in the left or right array, append them to the result array
    while (i < left.length) {
      result.push(left[i]);
      i++;
    }

    while (j < right.length) {
      result.push(right[j]);
      j++;
    }

    if (result.length == list.length) {
      setIsFinallyMerged(true);
    }

    result.map((name, index) => {
      setInProgressList((prev) => {
        let previousItem = prev.find((item) => item.name === name.name.name);

        if (previousItem && previousItem.position < index) {
          const updatedList = prev.filter(
            (item) => item.name !== name.name.name
          );
          return [
            ...updatedList,
            { name: name.name.name, position: index, id: name.nameId }
          ];
        } else if (!previousItem) {
          return [
            ...prev,
            { name: name.name.name, position: index, id: name.nameId }
          ];
        } else {
          return prev;
        }
      });
    });

    return result;
  };

  useEffect(() => {
    setDuels([]);

    const newList = mergeSort(list);

    setSortedList(newList);
  }, [votes]);

  const { user, isLoading } = useUser();

  const addVoteWithId = addVote.bind(null, user?.sub);

  const [statusMessage, formAction] = useFormState(addVoteWithId, null);
  const formElement = useRef<HTMLFormElement>(null);

  if (list.length === 0) {
    return;
  }

  if (isLoading) {
    return <CircularProgress />;
  }

  if (duels.length > 0) {
    return (
      <>
        <Typography variant="h3">Välj din favorit</Typography>
        <form action={formAction} ref={formElement}>
          <Duels duels={duels} />
        </form>
        {statusMessage && (
          <Box mt={2}>
            <Alert severity={statusMessage.severity}>
              {statusMessage.message}
            </Alert>
          </Box>
        )}
        <ListInProgress inProgressList={inProgressList} list={list} />
        <Votes votes={votes} list={list} />
      </>
    );
  }

  if (isFinallyMerged) {
    return (
      <>
        <Typography variant="h3">Röstningen är slutförd</Typography>
        <ol>
          {sortedList.map((list) => (
            <li key={list.nameId}>{list.name.name}</li>
          ))}
        </ol>
        <Votes votes={votes} list={list} />
      </>
    );
  }

  return (
    <>
      <Typography variant="body1">(Oklart vad som pågår)</Typography>
    </>
  );
};

const ListInProgress: React.FC<{
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

    console.log('newCombinedList', newCombinedList);
    setCombinedList(newCombinedList);
  }, [inProgressList, list]);

  useEffect(() => {
    let newListItems: JSX.Element[] = [];
    for (let i = 0; i <= maxPosition; i++) {
      console.log('i', i);

      const items = inProgressList
        .filter((item) => item.position === i)
        .map((item) => {
          return <NameBlob key={item.id} name={item.name} />;
        });
      newListItems.push(<li key={i}>{items}</li>);
    }

    console.log('newListItems', newListItems);

    setListItems(newListItems);
  }, [combinedList]);

  return (
    <>
      <Typography variant="h3">Listan (ej färdig)</Typography>
      <ol>{listItems}</ol>
    </>
  );
};

const Votes: React.FC<{ votes: Vote[]; list: ListWithNames[] }> = ({
  votes,
  list
}) => {
  const [votingLog, setVotingLog] = useState<string[]>([]);

  useEffect(() => {
    let newVotingLog: string[] = [];
    votes.map((vote) => {
      const winner = list.find((item) => item.nameId === vote.winnerId) || {
        name: { name: '???' }
      };
      const loser = list.find((item) => item.nameId === vote.loserId) || {
        name: { name: '???' }
      };
      newVotingLog.push(`${winner.name.name} > ${loser.name.name}`);
    });

    setVotingLog(newVotingLog);
  }, [votes]);

  return (
    <>
      <Typography variant="h3">Röstningslogg</Typography>
      <ul style={{ columns: 3 }}>
        {votingLog.map((log, index) => (
          <li key={index}>{log}</li>
        ))}
      </ul>
    </>
  );
};

const Duels: React.FC<{ duels: Duel[] }> = ({ duels }) => {
  return (
    <>
      <input type="hidden" name="left" value={duels[0].left.nameId} />
      <input type="hidden" name="right" value={duels[0].right.nameId} />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Card variant="outlined">
            <CardActionArea name="winner" value="left" type="submit">
              <CardContent
                sx={{
                  aspectRatio: '1/1',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.secondary.light,
                  fontSize: '3em'
                }}
              >
                {duels[0].left.name.name}
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card variant="outlined">
            <CardActionArea name="winner" value="right" type="submit">
              <CardContent
                sx={{
                  aspectRatio: '1/1',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.secondary.light,
                  fontSize: '3em'
                }}
              >
                {duels[0].right.name.name}
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

const NameBlob: React.FC<{ name: string }> = ({ name }) => {
  return (
    <span
      style={{
        backgroundColor: colors.secondary.light,
        padding: '5px',
        borderRadius: '5px'
      }}
    >
      {name}
    </span>
  );
};
