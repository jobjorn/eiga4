import { Fruit } from 'components/VotingBox';

type TwoFruits = [Fruit, Fruit];

export const getTwoFruits = (): Promise<TwoFruits> => {
  const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
  };
  const url = `${process.env.NEXT_PUBLIC_ROOT_URL}/api/twofruits`;
  const options = {
    method: 'GET',
    headers: defaultHeaders
  };
  return fetch(url, options)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        console.error(response.status);
      }
    })
    .then((response) => {
      return response.fruits;
    })
    .catch((error) => {
      console.error(error);
    });
};
