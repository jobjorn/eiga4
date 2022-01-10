import { Fruit } from 'components/VotingBox';
import { query } from 'lib/db';

export const getTwoFruitsFromDatabase = async () => {
  console.log('get two fruits from database');
  const result = await query(
    'SELECT id, fruit_name AS fruit, position FROM fruit_list ORDER BY RANDOM() LIMIT 2'
  );
  getPivot();
  const { rows }: { rows: Fruit[] } = result;
  return { fruits: rows };
};

export const getPivot = async () => {
  const pivotQuery = await query('SELECT * FROM fruit_list WHERE pivot = TRUE');
  const pivot = pivotQuery.rows[0];
  console.log('pivot:');
  console.log(pivot);

  if (pivot === undefined) {
    const positionGroupQuery = await query(
      'SELECT position, COUNT(position) as count FROM fruit_list GROUP BY position ORDER BY count DESC, position ASC LIMIT 1'
    ); // denna hämtar den största gruppen, den översta om det finns flera lika
    const positionGroup = positionGroupQuery.rows[0];
    console.log('positionGroup:');
    console.log(positionGroup);

    const newPivotQuery = await query(
      'UPDATE fruit_list SET pivot = true WHERE id IN (SELECT id FROM fruit_list WHERE position = $1 ORDER BY RANDOM() LIMIT 1) RETURNING *',
      [positionGroup.position]
    );
    const newPivot = newPivotQuery.rows[0];
    console.log('newPivot:');
    console.log(newPivot);

    const updatePositionsAboveQuery = await query(
      'UPDATE fruit_list SET position = position - 1 WHERE position < $1',
      [newPivot.position]
    );
    const updatePositionsAbove = updatePositionsAboveQuery.rows;
    console.log('updatePositionsAbove:');
    console.log(updatePositionsAbove);

    const updatePositionsBelowQuery = await query(
      'UPDATE fruit_list SET position = position + 1 WHERE position > $1',
      [newPivot.position]
    );
    const updatePositionsBelow = updatePositionsBelowQuery.rows;
    console.log('updatePositionsBelow:');
    console.log(updatePositionsBelow);
  } else {
    // här ska vi dubbelkolla om det finns >1 frukter kvar vid pivoten
  }

  // const result = await query('');
  // const { rows } = result;
  // return rows;
};

/* services to do 

1. HÄMTA PIVOT
a. utse en sådan om ingen finns
b. 1) antingen från den översta osorterade gruppen
b. 2) eller från den största osorterade gruppen
b. 3) detta skulle kunna bero på en inställning, sätt en boolean sålänge
c. justera positioner så att det finns plats nummermässigt över och under pivoten (alla som är över pivoten -1, alla som är under +1)

för detta behövs:
i. en database-service (där det mesta av köttandet sköts)
ii. en API-endpoint
iii. en local-service

input: ingen behövs

2. HÄMTA FRUKTER ATT RÖSTA PÅ
a. den ena frukten är pivoten.
b. den andra frukten är en annan frukt på samma nivå som pivoten

för detta behövs:
i. en database-service
ii. en API-endpoint
iii. en local-service

input: pivoten, men den finns i databasen, så ingen behövs

3. RÖSTA PÅ FRUKTER
a. två frukter som input där den ena är vinnare och den andra förlorare
b. den av dem som inte är pivoten ska få sin position justerad upp eller ner i förhållande till pivoten
c. rösten ska loggas i en särskild tabell

för detta behövs:
i. en database-service
ii. en API-endpoint
iii. en local-service

input: en vinnarfrukt och en förlorarfrukt (by ID)

4. HÄMTA EN LISTA ÖVER FRUKTER
a. en lista efter position bara, att mata ut på list-sidan

för detta behövs:
i. en database-service
ii. en API-endpoint
iii. en local-service





*/
