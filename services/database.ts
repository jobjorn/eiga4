import { Fruit } from 'components/VotingBox';
import { query } from 'lib/db';

export const getTwoFruitsFromDatabase = async () => {
  const result = await query(
    'SELECT id, fruit_name AS fruit, position FROM fruit_list ORDER BY RANDOM() LIMIT 2'
  );
  const { rows }: { rows: Fruit[] } = result;
  return { fruits: rows };
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
