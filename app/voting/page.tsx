import { getList, getVotes } from 'app/actions';
import { Voting } from 'components/Voting';

export default async function Page() {
  const list = await getList();
  const votes = await getVotes();

  return <Voting list={list} votes={votes} />;
}
