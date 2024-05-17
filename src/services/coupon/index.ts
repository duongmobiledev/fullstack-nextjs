import axios from '@common/utils/api';

import { ICheckCoupon } from '@typings';

export const checkCouponPromotionService = async (params: ICheckCoupon) => {
  return await axios.get('coupons/check_is_promo_coupon', { params });
};
