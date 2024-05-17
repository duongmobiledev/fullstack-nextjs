import { call, put } from 'redux-saga/effects';

import { getOrderListSuccess } from '@redux/actions/admin';
import { setLoading, setNotify } from '@redux/actions/common';

import { getOrderListService } from '@services/admin/order';

import { IResponse } from '@typings';

export function* getOrderList(payload: any) {
  yield put(setLoading(true));
  try {
    const variables = payload.payload;
    const response: IResponse = yield call(getOrderListService, variables);
    yield put(setLoading(false));
    const { data, status, success } = response || {};
    if (success) {
      yield put(getOrderListSuccess(data));
    }
  } catch (e) {
    yield put(setLoading(false));
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
