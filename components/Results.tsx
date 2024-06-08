'use client';

import { ArrowBackIosNew } from '@mui/icons-material';
import {
  Avatar,
  Button,
  Skeleton,
  TableContainer,
  Typography
} from '@mui/material';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { calculateMiddleColor } from 'lib/calculateMiddleColor';
import { ResultsList } from 'types/types';

export const Results: React.FC<{
  finished: boolean;
  list: ResultsList[];
  hasPartner: boolean;
  partnerMessage: string;
  partnerFinished: boolean;
  avatar?: string;
  partnerAvatar?: string;
}> = ({
  finished,
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
      setSortedList(newList);
    } else if (sortBy === 'averagePosition') {
      setSortedList(
        newList.sort((a, b) =>
          a.averagePosition && b.averagePosition
            ? a.averagePosition - b.averagePosition
            : 0
        )
      );
    } else if (sortBy === 'partnerPosition') {
      setSortedList(
        newList.sort((a, b) =>
          a.partnerPosition && b.partnerPosition
            ? a.partnerPosition - b.partnerPosition
            : 0
        )
      );
    } else if (sortBy === 'name') {
      setSortedList(newList.sort((a, b) => a.name.localeCompare(b.name)));
    }
  }, [sortBy, list]);

  const max = list.length + 1;

  if (sortedList.length === 0) {
    return <Skeleton></Skeleton>;
  }

  if (!finished) {
    return (
      <>
        <Typography variant="body1" style={{ flexGrow: 1 }}>
          Du måste rösta mera innan resultaten kan visas.
        </Typography>

        <Button
          LinkComponent={Link}
          style={{ alignSelf: 'flex-start' }}
          href="/voting"
          size="large"
          variant="text"
          color="secondary"
          startIcon={<ArrowBackIosNew />}
        >
          Fortsätt rösta
        </Button>
      </>
    );
  }

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
            {sortedList.map((name) => {
              if (!(name && name.name && name.name.length > 0)) {
                return null;
              }

              return (
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
              );
            })}
          </tbody>
        </table>
      </TableContainer>
    </>
  );
};
