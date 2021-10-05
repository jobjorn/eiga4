import ServerlessClient from 'serverless-postgres';
//import { Client } from 'pg';

export const client = new ServerlessClient({
  connectionString: process.env.DB_CONNECTION_STRING
});

export async function query(
  q: string,
  values: (string | number)[] | string | number = []
) {
  try {
    await client.connect();
    const results = await client.query(q, values);
    await client.clean();
    return results;
  } catch (e) {
    throw Error(e.message);
  }
}
