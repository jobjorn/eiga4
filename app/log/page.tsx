import { getList, getVotes } from 'app/actions';
import { VotingLog } from 'components/VotingLog';

export default async function Page() {
  const list = await getList();
  const votes = await getVotes();

  return <VotingLog votes={votes} list={list} />;
}
