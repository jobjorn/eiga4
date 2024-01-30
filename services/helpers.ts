import crypto from 'crypto';

export const gravatar = (email: string | undefined) => {
  if (email) {
    const hash = crypto.createHash('md5').update(email).digest('hex');

    return 'https://www.gravatar.com/avatar/' + hash + '?d=retro';
  } else {
    return 'https://www.gravatar.com/avatar/?d=retro';
  }
};
