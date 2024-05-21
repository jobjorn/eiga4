'use client';

import { Vote } from '@prisma/client';
import { useCallback, useEffect, useState } from 'react';
import { ListWithNames } from 'types/types';
import { NameBlob } from './VotingListInProgress';

export const Results: React.FC<{
  list: ListWithNames[];
  votes: Vote[];
}> = ({ list, votes }) => {
  const [sortedList, setSortedList] = useState<ListWithNames[]>([]);

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

      return result;
    },
    [votes]
  );

  // Recursive function to perform merge sort on an array of ListWithNames
  const mergeSort = useCallback(
    (list: ListWithNames[]): ListWithNames[] => {
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
    },
    [merge]
  );

  useEffect(() => {
    const newList = mergeSort(list);

    setSortedList(newList);
  }, [votes, list, mergeSort]);

  return (
    <>
      <ol>
        {sortedList.map((list) => (
          <li key={list.nameId} style={{ margin: '15px 0' }}>
            <NameBlob name={list.name} />
          </li>
        ))}
      </ol>
    </>
  );
};
