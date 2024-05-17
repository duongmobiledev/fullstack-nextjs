import { DISCOUNT_12_MONTH, DISCOUNT_6_MONTH } from '@constants/payment';

export const calcPackage = (amount: number, price: number) => {
  let total = price;
  switch (amount) {
    case 2:
      total *= amount;
      break;
    case 6:
      total = total * amount * ((100 - DISCOUNT_6_MONTH) / 100);
      break;
    case 12:
      total = total * amount * ((100 - DISCOUNT_12_MONTH) / 100);
    default:
      break;
  }
  return total;
};
export const calcPackageWithCoupon = (
  amount: number,
  price: number,
  discountBy?: 'price' | 'percent',
  priceCoupon?: number
) => {
  let total = calcPackage(amount, price);
  if (!discountBy || !priceCoupon) return total;
  if (discountBy === 'percent') {
    total -= (total * priceCoupon) / 100;
  } else {
    total -= priceCoupon;
  }
  return total < 0 ? 0 : total;
};
export const calcUpgradePackage = (
  oldPrice: number,
  amount: number,
  price: number
) => {
  const totalPackage = calcPackage(amount, price);
  return totalPackage - oldPrice;
};
export const calcUpgradeWithCoupon = (
  totalPrice: number,
  discountBy?: 'price' | 'percent',
  priceCoupon?: number
) => {
  let total = totalPrice;
  if (!discountBy || !priceCoupon) return total;
  if (discountBy === 'percent') {
    total -= (total * priceCoupon) / 100;
  } else {
    total -= priceCoupon;
  }
  return total < 0 ? 0 : total;
};
