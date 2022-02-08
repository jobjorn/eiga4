import { NextApiRequest, NextApiResponse } from 'next';
import { getListFromDatabase } from 'services/database';

const list = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    return new Promise((resolve) => {
      getListFromDatabase()
        .then((fruits) => {
          console.log('List API');
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

export default list;
