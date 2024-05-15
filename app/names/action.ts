'use server';

import { getSession } from '@auth0/nextjs-auth0';
import { StatusMessage } from 'types/types';

export async function startVoting(
  previousState: StatusMessage | null | undefined,
  formData: FormData
): Promise<StatusMessage> {
  if (formData === null) {
    return {
      severity: 'error',
      message: 'Ingen data i formuläret.',
      timestamp: Date.now()
    };
  }
  const session = await getSession();
  const user = session?.user ?? null;

  if (!user) {
    return {
      severity: 'error',
      message: 'Du verkar ej vara inloggad.',
      timestamp: Date.now()
    };
  }
  /* TODO: 
  uppdatera databasen med det nya schemat.
  använd den nya booleanen readyToVote för att visa olika states. 
  */

  console.log('USER', user);
}
