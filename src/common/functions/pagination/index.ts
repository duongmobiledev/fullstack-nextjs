/**
 * @description This function will check that Is this current page has a single item and
 *      its page index is greater than 1. It will return true
 * @warn make sure you define action clearly
 */

export const shouldDecreasePageIndex = (
  currentPage: number, // page starts with 1
  totalSize: number,
  numberItemsOfEachPage: number
) => {
  const numberItemsOfThisPage = getNumberItemsOfThisPage(
    currentPage,
    totalSize,
    numberItemsOfEachPage
  );

  if (numberItemsOfThisPage === 1 && currentPage > 1) {
    return true;
  }
  return false;
};

export const isLastPage = (
  page: number,
  totalItems: number,
  numberItemOfEachPage: number
): boolean => {
  let quotient = totalItems / numberItemOfEachPage;
  let lastPage: number = parseInt(quotient.toString());
  if (quotient - lastPage > 0) lastPage += 1;

  return lastPage === page ? true : false;
};

export const getNumberItemsOfThisPage = (
  page: number,
  totalItems: number,
  numberItemOfEachPage: number
) => {
  if (isLastPage(page, totalItems, numberItemOfEachPage)) {
    return totalItems - (page - 1) * numberItemOfEachPage;
  }

  return totalItems > numberItemOfEachPage ? numberItemOfEachPage : totalItems;
};
