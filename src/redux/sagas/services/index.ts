import { all, takeLatest } from 'redux-saga/effects';

import * as types from '@redux/types/services';

import {
  loadDataServices,
  loadDataDetailServices,
  applyRenewalCoupon,
} from './services';

export default function* services() {
  yield all([
    takeLatest(types.LOAD_DATA, loadDataServices),
    takeLatest(types.APPLY_COUPON, applyRenewalCoupon),
    takeLatest(types.LOAD_DATA_DETAIL, loadDataDetailServices),
  ]);
}
