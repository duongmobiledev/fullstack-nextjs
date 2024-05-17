import { put, call } from 'redux-saga/effects';

import { getHistorySuccess, getHistoryError } from '@redux/actions/affiliate';
import { setLoading, setNotify } from '@redux/actions/common';

import { getHistoryWithDrawApi } from '@services/affiliate/history';

import { IResponse } from '@typings';

export function* loadDataHistoryWithDraw(payload: any) {
  const params = payload.payload;
  try {
    yield put(setLoading(true));

    const response: IResponse = yield call(getHistoryWithDrawApi, params);

    yield put(setLoading(false));
    const { data, status, success } = response || {};
    if (success) {
      yield put(getHistorySuccess(data));
    } else {
      yield put(getHistoryError());
    }
  } catch (e) {
    console.log(e);
    yield put(getHistoryError());
    yield put(setLoading(false));

    setNotify({
      type: 'error',
      title: 'Failure',
      message: 'Đã có lỗi xảy ra với hệ thống, vui lòng thử lại sau ! !',
    });
  }
}
