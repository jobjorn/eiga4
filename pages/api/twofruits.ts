import { NextApiRequest, NextApiResponse } from 'next';
import { getTwoFruitsFromDatabase } from 'services/database';

const twoFruits = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    return new Promise((resolve) => {
      getTwoFruitsFromDatabase()
        .then((fruits) => {
          console.log('twoFruits API');
          res.status(200).json(fruits);
          resolve('');
        })
        .catch((error) => {
          res.status(500).end(error);
          return resolve('');
        });
    });
  } else {
    res.status(404).end();
  }
};

export default twoFruits;
