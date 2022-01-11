import { NextApiRequest, NextApiResponse } from 'next';
import { getPivot } from 'services/database';

const pivot = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    return new Promise((resolve) => {
      getPivot()
        .then((pivot) => {
          console.log('pivot API');
          res.status(200).json(pivot);
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

export default pivot;
