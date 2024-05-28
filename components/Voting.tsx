'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import {
  Typography,
  Box,
  Alert,
  CircularProgress,
  Button
} from '@mui/material';
import { Vote } from '@prisma/client';
import Link from 'next/link';
import { useRef, useEffect, useState, useCallback } from 'react';
import { useFormState } from 'react-dom';
import { addVote } from 'app/voting/actions';
import { Duel, ListWithNames } from 'types/types';
import { Duels } from './VotingDuels';

export const Voting: React.FC<{ list: ListWithNames[]; votes: Vote[] }> = ({
  list,
  votes
}) => {
  const [duels, setDuels] = useState<Duel[]>([]);
  const [isFinallyMerged, setIsFinallyMerged] = useState(false);

  // Function to merge two sorted arrays into a single sorted array
  const merge = useCallback(
    (left: ListWithNames[], right: ListWithNames[]): ListWithNames[] => {
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

      return result;
    },
    [list.length, votes]
  );

  // Recursive function to perform merge sort on an array of ListWithNames
  const mergeSort = useCallback(
    (list: ListWithNames[]): ListWithNames[] => {
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
    },
    [merge]
  );

  useEffect(() => {
    setDuels([]);

    mergeSort(list);
  }, [votes, list, mergeSort]);

  const { user, isLoading } = useUser();

  const addVoteWithId = addVote.bind(null, user?.sub ?? '');

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
        <Typography variant="body1" style={{ marginBottom: '1rem' }}>
          Det tredje steget är att rangordna de namn ni valt genom en
          omröstning. Klicka på den du föredrar i varje par.
        </Typography>
        <form
          action={formAction}
          ref={formElement}
          style={{ flexGrow: 1, display: 'flex' }}
        >
          <Duels duels={duels} />
        </form>
        {statusMessage && (
          <Box mt={2}>
            <Alert severity={statusMessage.severity}>
              {statusMessage.message}
            </Alert>
          </Box>
        )}
      </>
    );
  }

  if (isFinallyMerged) {
    return (
      <>
        <Box style={{ flexGrow: 1 }}>
          <Typography variant="body1">Listan är färdigsorterad.</Typography>
        </Box>

        <Button
          LinkComponent={Link}
          style={{ alignSelf: 'flex-end' }}
          href="/results"
          size="large"
          variant="text"
          color="secondary"
          endIcon={<ArrowForwardIosIcon />}
        >
          Se resultatet
        </Button>
      </>
    );
  }

  return (
    <>
      <Alert severity="error">Något verkar ha gått fel.</Alert>
    </>
  );
};
