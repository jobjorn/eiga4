'use client';

import { Vote } from '@prisma/client';
import { ListWithNames } from './OverviewList';
import {
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent
} from '@mui/material';
import { useEffect, useState } from 'react';

type Duel = {
  left: ListWithNames;
  right: ListWithNames;
};

export const VotingDuel: React.FC<{ list: ListWithNames[]; votes: Vote[] }> = ({
  list,
  votes
}) => {
  const [duels, setDuels] = useState<Duel[]>([]);
  const [sortedList, setSortedList] = useState<ListWithNames[]>([]);

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
        (vote) => vote.winnerId === left[i].id && vote.loserId === right[j].id
      );
      const isRightWinner = votes.find(
        (vote) => vote.winnerId === right[j].id && vote.loserId === left[i].id
      );
      // Compare the number of votes for the current lists and push the list with more votes to the result array
      if (isLeftWinner) {
        result.push(left[i]);
        i++;
      } else if (isRightWinner) {
        result.push(right[j]);
        j++;
      } else {
        console.error(
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

    // Return the merged and sorted array
    return result;
  };

  useEffect(() => {
    const newList = mergeSort(list);

    setSortedList(newList);
  }, []);

  console.log('duels', duels);

  if (duels.length > 0) {
    return (
      <>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Card>
              <CardActionArea onClick={() => {}}>
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
              <CardActionArea onClick={() => {}}>
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
      </>
    );
  }

  return (
    <>
      <Typography variant="body1">Inget att duellera</Typography>
    </>
  );
};
