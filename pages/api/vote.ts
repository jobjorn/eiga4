import { query } from 'lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

interface Vote {
  winner: number;
  loser: number;
  pivot: number;
}

const createVote = async (vote: Vote) => {
  try {
    const voteLog = await query(
      'INSERT INTO vote_log(winner, loser) VALUES ($1, $2)',
      [vote.winner, vote.loser]
    );
    voteLog;
    if (vote.winner === vote.pivot) {
      const editPosition = await query(
        'UPDATE fruit_list SET position = position + 1 WHERE id = $1',
        [vote.loser]
      );
    } else {
      const editPosition = await query(
        'UPDATE fruit_list SET position = position - 1 WHERE id = $1',
        [vote.winner]
      );
    }

    const result = 'okokkhkhkjgjh';
    return result;
  } catch (error) {
    console.log(error);
  }
};

const vote = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    return new Promise((resolve) => {
      const { winner, loser, pivot }: Vote = req.body;

      createVote({
        winner,
        loser,
        pivot
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
