export const getUnixTimestamp = (value?: string | number) => {
  const date = new Date(value);
  const timestamp = date.getTime();
  return Math.floor(timestamp / 1000);
};
