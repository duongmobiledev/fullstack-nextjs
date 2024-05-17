export interface ICoupon {
  value?: {
    price?: number;
    discountBy: 'price' | 'percent';
    percent?: number;
  };
}
export interface ICheckCoupon {
  code: string;
  serviceId: string;
}
export interface ICheckCouponRespon {
  coupon: ICoupon;
}
