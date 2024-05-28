import { getNameList } from 'app/actions';
import { PageTitle } from 'app/uicomponents/PageTitle';
import { Voting } from 'components/Voting';
import { getVotes } from './actions';

export default async function Page() {
  const list = await getNameList();
  const votes = await getVotes();

  return (
    <>
      <PageTitle>3. Rösta</PageTitle>
      <Voting list={list} votes={votes} />
    </>
  );
}
