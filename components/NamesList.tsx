'use client';
import { UserProfile, useUser } from '@auth0/nextjs-auth0/client';
import { Alert, Avatar, Box, Skeleton, Typography } from '@mui/material';
import React, { useRef } from 'react';
import { useFormState } from 'react-dom';
import { AiOutlineClose } from 'react-icons/ai';
import { removeName } from 'app/actions';
import { theme } from 'styles/theme';
import { ListWithNames } from 'types/types';
import { Submit } from './Submit';

export const NamesList: React.FC<{ list: ListWithNames[] }> = ({ list }) => {
  const formElement = useRef<HTMLFormElement>(null);
  const [statusMessage, formAction] = useFormState(removeName, null);
  const { user } = useUser();

  if (!user) {
    return <Skeleton></Skeleton>;
  }
  console.log('list', list);

  return (
    <form action={formAction} ref={formElement}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
          gap: '5px'
        }}
      >
        {list.map((item) => {
          if (item) {
            return <NameTag item={item} user={user} key={item.id} />;
          } else {
            return <></>;
          }
        })}
      </div>

      {statusMessage && (
        <Box mt={2}>
          <Alert severity={statusMessage.severity}>
            {statusMessage.message}
          </Alert>
        </Box>
      )}
    </form>
  );
};

const NameTag: React.FC<{ item: ListWithNames; user: UserProfile }> = ({
  item,
  user
}) => {
  let removable = user?.email === item.user || item.double;
  let avatar = (
    <Avatar
      alt={item.user}
      sx={{
        bgcolor: theme.palette.primary.main,
        width: '2rem',
        height: '2rem'
      }}
      src={item.avatar}
    />
  );

  if (item.double) {
    let leftAvatar = item.avatar;
    let rightAvatar = item.doubleAvatar;

    if (item.user !== user.email) {
      leftAvatar = item.doubleAvatar;
      rightAvatar = item.avatar;
    }
    avatar = (
      <div
        style={{
          position: 'relative',
          width: '2rem',
          height: '2rem'
        }}
      >
        <Avatar
          src={leftAvatar}
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
          src={rightAvatar}
          sx={{
            width: '2rem',
            height: '2rem',
            clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        />
      </div>
    );
  }

  return (
    <div
      key={item.id}
      style={{
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: '5px',
        display: `flex`,
        justifyContent: `space-between`,
        alignItems: `center`,
        padding: '2px'
      }}
    >
      <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
        {item.avatar !== undefined && avatar}

        <Typography variant="body1">{item.name}</Typography>
      </div>
      {removable && (
        <Submit variant="text" name="remove" value={item.nameId}>
          <AiOutlineClose />
        </Submit>
      )}
    </div>
  );
};
