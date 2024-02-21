'use client';

import React from 'react';
import { ListWithNames } from './OverviewList';

export const OverviewListTree: React.FC<{ list: ListWithNames[] }> = ({
  list
}) => {
  const depth = Math.max(...list.map((item) => item.subarray?.length || 0));

  const getColumnItems = (letters: string) => {
    return list.filter((item) => item.subarray?.startsWith(letters));
  };

  const generateCombinations = (maxLength: number): string[] => {
    const combinations: string[] = [];

    const backtrack = (path: string, length: number) => {
      if (length === 0) {
        combinations.push(path); // Include the current path in combinations
        return;
      }

      backtrack(path + 'L', length - 1);
      backtrack(path + 'R', length - 1);
    };

    for (let i = 1; i <= maxLength; i++) {
      backtrack('', i);
    }

    combinations.sort((a, b) => {
      if (a.length !== b.length) {
        return a.length - b.length; // Sort by length first (shortest first)
      } else {
        return a.localeCompare(b); // Sort alphabetically
      }
    });

    return combinations;
  };

  const gridDiv = (letters: string) => {
    return (
      <div style={{ gridColumnStart: letters.length }}>
        <strong>{letters}</strong>
        {getColumnItems(letters).map((item) => (
          <div key={item.id}>
            {item.name.name} ({item.subarray})
          </div>
        ))}
      </div>
    );
  };

  function generateList(list: ListWithNames[], subarray: string) {
    const filteredList = list.filter((item) => item.subarray == subarray);

    return (
      <ul>
        {filteredList.map((item) => (
          <li key={item.id}>
            {item.position}. {item.name.name} ({item.subarray})
          </li>
        ))}
      </ul>
    );
  }

  function recursiveDiv(
    list: ListWithNames[],
    depth: number,
    level: number,
    start: string
  ) {
    if (start.length < depth) {
      const left = start + 'L';
      const right = start + 'R';

      const leftCount = list.filter((item) =>
        item.subarray?.startsWith(left)
      ).length;
      const rightCount = list.filter((item) =>
        item.subarray?.startsWith(right)
      ).length;

      return (
        <>
          {leftCount > 0 && (
            <div
              style={{
                border: '1px solid lime',
                padding: '5px',
                margin: '5px'
              }}
            >
              <strong>{left}</strong>
              {generateList(list, left)}
              {recursiveDiv(list, depth, level + 1, left)}
            </div>
          )}
          {rightCount > 0 && (
            <div
              style={{ border: '1px solid red', padding: '5px', margin: '5px' }}
            >
              <strong>{right}</strong>
              {generateList(list, right)}
              {recursiveDiv(list, depth, level + 1, right)}
            </div>
          )}
        </>
      );
    } else {
      return;
    }
  }

  console.log('combinations', generateCombinations(3));

  return (
    <>
      <div>{recursiveDiv(list, depth, 0, '')}</div>
    </>
  );
};
