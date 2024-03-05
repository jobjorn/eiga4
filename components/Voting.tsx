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

type Duel = {
  left: ListWithNames;
  right: ListWithNames;
};

export const Voting: React.FC<{ list: ListWithNames[]; votes: Vote[] }> = ({
  list,
  votes
}) => {
  console.log('votes', votes);

  const [duels, setDuels] = useState<Duel[]>([]);
  const [sortedList, setSortedList] = useState<ListWithNames[]>([]);
  const [isFinallyMerged, setIsFinallyMerged] = useState(false);

  // Recursive function to perform merge sort on an array of ListWithNames
  const mergeSort = (list: ListWithNames[]): ListWithNames[] => {
    console.log('initierar en mergeSort', list.length);

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
    console.log('initierar en merge', left.length, right.length);

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
        console.log(
          'Här behövs en jämförelse',
          left[i].name.name,
          right[j].name.name
        );
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

    // Return the merged and sorted array
    return result;
  };

  useEffect(() => {
    setDuels([]);

    const newList = mergeSort(list);
    console.log('nu kör vi useeffecten som sorterar listan');

    setSortedList(newList);
  }, [votes]);

  console.log('duels', duels);

  const { user, isLoading } = useUser();

  const addVoteWithId = addVote.bind(null, user?.sub);

  const [statusMessage, formAction] = useFormState(addVoteWithId, null);
  const formElement = useRef<HTMLFormElement>(null);

  useEffect(() => {
    console.log('statusMessage', statusMessage);
    console.log('formElement', formElement);
  }, [statusMessage]);

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
        {statusMessage && (
          <Box mt={2}>
            <Alert severity={statusMessage.severity}>
              {statusMessage.message}
            </Alert>
          </Box>
        )}
        <form action={formAction} ref={formElement}>
          <input type="hidden" name="left" value={duels[0].left.nameId} />
          <input type="hidden" name="right" value={duels[0].right.nameId} />
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Card>
                <CardActionArea name="winner" value="left" type="submit">
                  <CardContent
                    sx={{
                      aspectRatio: '1/1',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    {duels[0].left.name.name}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card>
                <CardActionArea name="winner" value="right" type="submit">
                  <CardContent
                    sx={{
                      aspectRatio: '1/1',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    {duels[0].right.name.name}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
        </form>
      </>
    );
  }

  if (isFinallyMerged) {
    return (
      <>
        <Typography variant="h3">Sorterad lista!</Typography>
        <ol>
          {sortedList.map((list) => (
            <li key={list.nameId}>{list.name.name}</li>
          ))}
        </ol>
      </>
    );
  }

  return (
    <>
      <Typography variant="body1">(Oklart vad som pågår)</Typography>
    </>
  );
};
