import { getNameList, getVotes } from 'app/actions';
import { Voting } from 'components/Voting';

export default async function Page() {
  const list = await getNameList();
  const votes = await getVotes();

  return <Voting list={list} votes={votes} />;
}
