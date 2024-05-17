import { call, put } from 'redux-saga/effects';

import { setLoading, setNotify } from '@redux/actions/common';
import {
  getLicenseDetailResultError,
  getLicenseDetailResultSuccess,
} from '@redux/actions/onepay';

import { getInvoiceDetailAPI, getLicenseDetailAPI } from '@services/onepay';

import { IResponse } from '@typings';

export function* getLicenseDetail(payload: any) {
  try {
    const params = payload.payload;
    yield put(setLoading(true));
    const response: IResponse = yield call(getLicenseDetailAPI, params);
    yield put(setLoading(false));
    const { data, status, success } = response || {};
    if (success && data != null) {
      yield put(getLicenseDetailResultSuccess(data));
    } else {
      yield put(getLicenseDetailResultError());
    }
  } catch (e) {
    yield put(getLicenseDetailResultError());
    yield put(setLoading(false));

    yield put(
      setNotify({
        type: 'error',
        title: 'Failure',
        message: 'Đã có lỗi xảy ra với hệ thống, vui lòng thử lại sau ! !',
      })
    );
  }
}
export function* getInvoiceDetail(payload: any) {
  try {
    const params = payload.payload;
    yield put(setLoading(true));
    const response: IResponse = yield call(getInvoiceDetailAPI, params);
    yield put(setLoading(false));

    const { data, status, success } = response || {};

    if (success && data != null) {
      yield put(getLicenseDetailResultSuccess(data));
    } else {
      yield put(getLicenseDetailResultError());
    }
  } catch (e) {
    yield put(getLicenseDetailResultError());
    yield put(setLoading(false));
    yield put(
      setNotify({
        type: 'error',
        title: 'Failure',
        message: 'Đã có lỗi ra với hệ thống, vui lòng thử lại sau ! !',
      })
    );
  }
}
