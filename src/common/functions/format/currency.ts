export const currency = (currenCy) => {
  return currenCy
    .toString()
    .split('')
    .reverse()
    .reduce((prev, next, index) => {
      return (index % 3 ? next : next + '.') + prev;
    });
};

export const formatCurrencyVND = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
};
