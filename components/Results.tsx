'use client';

import { Avatar, Skeleton, TableContainer, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { ResultsList } from 'types/types';

export const Results: React.FC<{
  list: ResultsList[];
  hasPartner: boolean;
  partnerMessage: string;
  partnerFinished: boolean;
  avatar?: string;
  partnerAvatar?: string;
}> = ({
  list,
  hasPartner,
  partnerMessage,
  partnerFinished,
  avatar,
  partnerAvatar
}) => {
  const [sortBy, setSortBy] = useState('position');
  const [sortedList, setSortedList] = useState<ResultsList[]>(list);

  useEffect(() => {
    let newList = [...list];

    if (sortBy === 'position') {
      console.log('Sorting by position');
      setSortedList(newList);
    } else if (sortBy === 'averagePosition') {
      console.log('Sorting by averagePosition');
      setSortedList(
        newList.sort((a, b) =>
          a.averagePosition && b.averagePosition
            ? a.averagePosition - b.averagePosition
            : 0
        )
      );
    } else if (sortBy === 'partnerPosition') {
      console.log('Sorting by partnerPosition');
      setSortedList(
        newList.sort((a, b) =>
          a.partnerPosition && b.partnerPosition
            ? a.partnerPosition - b.partnerPosition
            : 0
        )
      );
    } else if (sortBy === 'name') {
      console.log('Sorting by name');
      setSortedList(newList.sort((a, b) => a.name.localeCompare(b.name)));
    }
  }, [sortBy, list]);

  const max = list.length + 1;

  const calculateMiddleColor = ({
    color1 = '9ad29c',
    color2 = 'fff391',
    color3 = 'ea8f8f',
    ratio
  }: {
    color1?: string;
    color2?: string;
    color3?: string;
    ratio: number;
  }) => {
    const hex = (color: number) => {
      const colorString = color.toString(16);
      return colorString.length === 1 ? `0${colorString}` : colorString;
    };

    if (ratio <= 0.5) {
      let newRatio = ratio * 2;

      const r = Math.ceil(
        parseInt(color2.substring(0, 2), 16) * newRatio +
          parseInt(color1.substring(0, 2), 16) * (1 - newRatio)
      );
      const g = Math.ceil(
        parseInt(color2.substring(2, 4), 16) * newRatio +
          parseInt(color1.substring(2, 4), 16) * (1 - newRatio)
      );
      const b = Math.ceil(
        parseInt(color2.substring(4, 6), 16) * newRatio +
          parseInt(color1.substring(4, 6), 16) * (1 - newRatio)
      );

      return hex(r) + hex(g) + hex(b);
    } else {
      let newRatio = ratio * 2 - 1;

      const r = Math.ceil(
        parseInt(color3.substring(0, 2), 16) * newRatio +
          parseInt(color2.substring(0, 2), 16) * (1 - newRatio)
      );
      const g = Math.ceil(
        parseInt(color3.substring(2, 4), 16) * newRatio +
          parseInt(color2.substring(2, 4), 16) * (1 - newRatio)
      );
      const b = Math.ceil(
        parseInt(color3.substring(4, 6), 16) * newRatio +
          parseInt(color2.substring(4, 6), 16) * (1 - newRatio)
      );

      return hex(r) + hex(g) + hex(b);
    }
  };

  if (sortedList.length === 0) {
    return <Skeleton></Skeleton>;
  }
  console.log('list', list);
  console.log('sortedList', sortedList);
  return (
    <>
      <Typography variant="body1" sx={{ marginBottom: '1rem' }}>
        {partnerMessage}
      </Typography>
      <TableContainer>
        <table className="resultsTable">
          <thead>
            <tr>
              <th onClick={() => setSortBy('position')}>
                {hasPartner ? (
                  <Avatar src={avatar} sx={{ width: '2rem', height: '2rem' }} />
                ) : (
                  '#'
                )}
              </th>
              {partnerFinished && (
                <th onClick={() => setSortBy('averagePosition')}>
                  <div
                    style={{
                      position: 'relative',
                      width: '2rem',
                      height: '2rem'
                    }}
                  >
                    <Avatar
                      src={avatar}
                      sx={{
                        width: '2rem',
                        height: '2rem',
                        clipPath: 'polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)',
                        position: 'absolute',
                        top: 0,
                        left: 0
                      }}
                    />
                    <Avatar
                      src={partnerAvatar}
                      sx={{
                        width: '2rem',
                        height: '2rem',
                        clipPath:
                          'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)',
                        position: 'absolute',
                        top: 0,
                        left: 0
                      }}
                    />
                  </div>
                </th>
              )}
              {partnerFinished && (
                <th onClick={() => setSortBy('partnerPosition')}>
                  <Avatar
                    src={partnerAvatar}
                    sx={{ width: '2rem', height: '2rem' }}
                  />
                </th>
              )}
              <th onClick={() => setSortBy('name')} className="nameCell">
                Namn
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedList.map((name) => (
              <tr key={name.id}>
                <td
                  className="positionCell"
                  style={{
                    backgroundColor: `#${calculateMiddleColor({
                      ratio: name.position / max
                    })}`,
                    textAlign: 'center'
                  }}
                >
                  {name.position}
                </td>
                {partnerFinished && name.averagePosition && (
                  <td
                    className="positionCell"
                    style={{
                      backgroundColor: `#${calculateMiddleColor({
                        ratio: name.averagePosition / max
                      })}`,
                      textAlign: 'center'
                    }}
                  >
                    {name.averagePosition.toFixed(0)}
                  </td>
                )}
                {partnerFinished && name.partnerPosition && (
                  <td
                    className="positionCell"
                    style={{
                      backgroundColor: `#${calculateMiddleColor({
                        ratio: name.partnerPosition / max
                      })}`,
                      textAlign: 'center'
                    }}
                  >
                    {name.partnerPosition}
                  </td>
                )}
                <td className="nameCell">{name.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableContainer>
    </>
  );
};
