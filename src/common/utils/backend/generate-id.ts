import { customAlphabet } from 'nanoid';

export const genAccountId = () => {
  const nanoid = customAlphabet('1234567890', 6);
  const numString = nanoid();
  return Number(numString);
};

export const genRefreshToken = () => {
  const nanoid = customAlphabet('1234567890abcdefABCDEFGH', 40);
  const res = nanoid();
  return res;
};
