import { Box, Skeleton } from '@mui/material';
import { Vote } from '@prisma/client';
import { getNameList } from 'app/actions';
import { getUserWithPartners } from 'app/overview/actions';
import { PageTitle } from 'app/uicomponents/PageTitle';
import { getPartnerVotes, getVotes } from 'app/voting/actions';
import { Results } from 'components/Results';
import { ListWithNames, ResultsList } from 'types/types';

// Function to merge two sorted arrays into a single sorted array
const merge = (
  left: ListWithNames[],
  right: ListWithNames[],
  votes: Vote[]
): ListWithNames[] => {
  // Initialize an empty array to store the merged result
  let result: ListWithNames[] = [];

  // Initialize two pointers, i and j, to track the indices of the left and right arrays
  let i = 0;
  let j = 0;

  // Compare the elements of the left and right arrays and merge them in sorted order
  while (i < left.length && j < right.length) {
    const isLeftWinner = votes.find(
      (vote) =>
        vote.winnerId === left[i].nameId && vote.loserId === right[j].nameId
    );
    const isRightWinner = votes.find(
      (vote) =>
        vote.winnerId === right[j].nameId && vote.loserId === left[i].nameId
    );
    // Compare the number of votes for the current lists and push the list with more votes to the result array
    if (isLeftWinner) {
      result.push(left[i]);
      i++;
    } else if (isRightWinner) {
      result.push(right[j]);
      j++;
    } else {
      return [];
    }
  }

  // If there are any remaining elements in the left or right array, append them to the result array
  while (i < left.length) {
    result.push(left[i]);
    i++;
  }

  while (j < right.length) {
    result.push(right[j]);
    j++;
  }

  return result;
};

// Recursive function to perform merge sort on an array of ListWithNames
const mergeSort = (list: ListWithNames[], votes: Vote[]): ListWithNames[] => {
  //   console.log('initierar en mergeSort', list.length);

  // Base case: if the array has 1 or 0 elements, it is already sorted
  if (list.length <= 1) {
    return list;
  }

  // Find the middle index of the array
  const mid = Math.floor(list.length / 2);

  // Split the array into two halves: left and right
  const left = list.slice(0, mid);
  const right = list.slice(mid);

  // Recursively call mergeSort on the left and right halves
  return merge(mergeSort(left, votes), mergeSort(right, votes), votes);
};

export default async function Page() {
  const list = await getNameList();
  const votes = await getVotes();

  const user = await getUserWithPartners();

  let hasPartner = false;
  let partnerFinished = false;
  let partnerMessage = '';

  if (user === null) {
    return <Skeleton style={{ flexGrow: 1 }} />;
  } else if (user.partnering.length == 0 && user.partnered.length == 0) {
    // Om användaren inte har någon definierad partner och inte heller någon inbjudan till att bli partnerad
  } else if (user.partnering.length > 0 && user.partnered.length == 0) {
    // Om användaren har skickat en inbjudan som ännu inte besvarats
    partnerMessage =
      'Du har skickat en inbjudan till en partner som ännu inte besvarats. Endast dina resultat visas nedan.';
  } else if (user.partnering.length == 0 && user.partnered.length > 0) {
    // Om användaren har en inbjudan som inte besvarats
    partnerMessage =
      'Du har en inbjudan att bli partner som du ännu inte besvarat. Endast dina resultat visas nedan.';
  } else if (user.partnering.length > 0 && user.partnered.length > 0) {
    // Om användaren har en partner
    hasPartner = true;
  }

  const sortedList = mergeSort(list, votes);

  let sortedPartnerList: ListWithNames[] = [];
  if (hasPartner) {
    const partnerVotes = await getPartnerVotes();
    sortedPartnerList = mergeSort(list, partnerVotes);

    if (sortedPartnerList.length !== list.length) {
      partnerMessage =
        'Din partner är inte klar med röstningen ännu, endast dina resultat visas nedan.';
    } else {
      partnerMessage = 'Ni har båda röstat klart, här är era resultat.';
      partnerFinished = true;
    }
  }

  let resultsList: ResultsList[] = [];

  sortedList.forEach((name, index) => {
    if (partnerFinished) {
      let position = index + 1;
      let partnerPosition =
        sortedPartnerList.findIndex(
          (partnerName) => partnerName.name === name.name
        ) + 1;
      let averagePosition = (position + partnerPosition) / 2;

      resultsList.push({
        ...name,
        position,
        averagePosition,
        partnerPosition
      });
    } else {
      resultsList.push({ ...name, position: index + 1 });
    }
  });

  return (
    <>
      <Box style={{ flexGrow: 1 }}>
        <PageTitle>4. Resultat</PageTitle>
        <Results
          list={resultsList}
          hasPartner={hasPartner}
          partnerMessage={partnerMessage}
          partnerFinished={partnerFinished}
          avatar={user.picture || undefined}
          partnerAvatar={user.partnered[0]?.partnering.picture || undefined}
        />
      </Box>
    </>
  );
}
