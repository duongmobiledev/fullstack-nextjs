import { call, put } from 'redux-saga/effects';

import { setLoading, setNotify } from '@redux/actions/common';
import { checkCouponResult, setLoadingCheck } from '@redux/actions/coupon';

import { checkCouponPromotionService } from '@services/coupon';

import { IResponse } from '@typings';

export function* checkCouponPromotionSaga(payload: any) {
  try {
    const variables = payload.payload;
    yield put(setLoadingCheck(true));
    const response: IResponse = yield call(
      checkCouponPromotionService,
      variables
    );
    yield put(setLoadingCheck(false));
    const { data, status, success } = response || {};
    if (success) {
      yield put(checkCouponResult(data));
    }
  } catch (e) {
    yield put(setLoadingCheck(false));
    console.log(e);
    yield put(
      setNotify({
        type: 'error',
        title: 'Lỗi',
        message: 'Đã có lỗi xảy ra với hệ thống, vui lòng thử lại sau ! !',
      })
    );
  }
}
