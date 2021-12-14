import { Fruit } from 'components/VotingBox';
import { query } from 'lib/db';

export const getTwoFruitsFromDatabase = async () => {
  const result = await query(
    'SELECT id, fruit_name AS fruit, position FROM fruit_list ORDER BY RANDOM() LIMIT 2'
  );
  const { rows }: { rows: Fruit[] } = result;
  return { fruits: rows };
};
