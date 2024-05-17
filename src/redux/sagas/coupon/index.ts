import { all, takeLatest } from 'redux-saga/effects';

import * as types from '@redux/types/coupon';

import { checkCouponPromotionSaga } from './coupon';

export default function* coupon() {
  yield all([
    takeLatest(types.CHECK_COUPON_PROMOTION, checkCouponPromotionSaga),
  ]);
}
