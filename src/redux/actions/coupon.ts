import * as types from '@redux/types/coupon';

import { ICheckCoupon, ICheckCouponRespon } from '@typings';

export const checkCouponPromotion = (payload: ICheckCoupon) => {
  return { type: types.CHECK_COUPON_PROMOTION, payload };
};
export const checkCouponResult = (payload: ICheckCouponRespon) => ({
  type: types.CHECK_COUPON_PROMOTION_RESULT,
  payload,
});

export const resetCoupon = () => ({ type: types.RESET_COUPON });

export const setLoadingCheck = (payload: boolean) => ({
  type: types.SET_LOADING_CHECK,
  payload,
});
