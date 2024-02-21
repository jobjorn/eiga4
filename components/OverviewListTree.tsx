import React from 'react';
import { ListWithNames } from './OverviewList';

export const OverviewListTree: React.FC<{ list: ListWithNames[] }> = ({
  list
}) => {
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

  function recursiveDiv(list: ListWithNames[], start: string) {
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
              border: '3px solid lime',
              padding: '2px',
              margin: '2px'
            }}
          >
            <strong>{left}</strong>
            {generateList(list, left)}
            {recursiveDiv(list, left)}
          </div>
        )}
        {rightCount > 0 && (
          <div
            style={{ border: '3px solid red', padding: '2px', margin: '2px' }}
          >
            <strong>{right}</strong>
            {generateList(list, right)}
            {recursiveDiv(list, right)}
          </div>
        )}
      </>
    );
  }

  return recursiveDiv(list, '');
};
