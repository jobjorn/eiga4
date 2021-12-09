import { query } from 'lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

interface PostRequestBody {
  fruitId: number;
}
interface FruitVote {
  fruitId: number;
}

const createVote = async (vote: FruitVote) => {
  try {
    const result = await query(
      'UPDATE fruit_list SET position = position + 1 WHERE id = $1',
      [vote.fruitId]
    );
    return result;
  } catch (error) {
    console.log(error);
  }
};

const vote = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    return new Promise((resolve) => {
      const { fruitId }: PostRequestBody = req.body;

      createVote({
        fruitId: fruitId
      })
        .then((vote) => {
          res.status(200).json(vote);
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

export default vote;
