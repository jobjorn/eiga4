'use client';

import { Vote } from '@prisma/client';
import { Typography, Box, Alert, CircularProgress } from '@mui/material';
import { useRef, useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useUser } from '@auth0/nextjs-auth0/client';
import { addVote } from 'app/actions';
import { Duel, InProgressList, ListWithNames } from 'types/types';
import { VotingLog } from './VotingLog';
import { VotingListInProgress } from './VotingListInProgress';
import { Duels } from './VotingDuels';
import { VotingListComplete } from './VotingListComplete';

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

  if (isLoading) {
    return <CircularProgress />;
  }

  if (list.length === 0) {
    return <Alert severity="error">Inga namn att rösta på!</Alert>;
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
        <VotingListInProgress inProgressList={inProgressList} list={list} />
        <VotingLog votes={votes} list={list} />
      </>
    );
  }

  if (isFinallyMerged) {
    return (
      <>
        <VotingListComplete sortedList={sortedList} />
        <VotingLog votes={votes} list={list} />
      </>
    );
  }

  return (
    <>
      <Alert severity="error">Något verkar ha gått fel.</Alert>
    </>
  );
};
