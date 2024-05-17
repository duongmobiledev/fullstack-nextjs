import { createContext, SetStateAction } from 'react';

interface ICouponContext {
  couponType: ECouponType;
  setCouponType: React.Dispatch<SetStateAction<ECouponType>>;
}
export const CouponContext = createContext<ICouponContext>(
  {} as ICouponContext
);
export enum ECouponType {
  RENEWAL = 'renewal',
  PROMO = 'promo',
}
export enum EPromotionType {
  PRICE = 'price',
  PERCENT = 'percent',
}
