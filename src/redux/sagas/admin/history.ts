import { call, put } from 'redux-saga/effects';
import { IUploadBannerRequest } from 'src/typings/Admin/Banner';

import {
  loadDataHistorySuccess,
  loadSearchHistorySuccess,
} from '@redux/actions/admin/history';
import { setLoading, setNotify } from '@redux/actions/common';

import {
  getHistoryAdmin,
  getSearchHistoryAdmin,
} from '@services/admin/history';

import { IResponse } from '@typings';

export function* getSearchHistory(payload: any) {
  try {
    const variables = payload.payload;
    const response: IResponse = yield call(getSearchHistoryAdmin, variables);

    const { data, status, success } = response || {};
    if (success) {
      yield put(loadSearchHistorySuccess(data));
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

export function* getDataHistoryAdmin(payload: any) {
  yield put(setLoading(true));
  try {
    const variables = payload.payload;
    const response: IResponse = yield call(getHistoryAdmin, variables);
    yield put(setLoading(false));
    const { data, status, success } = response || {};
    if (success) {
      yield put(loadDataHistorySuccess(data));
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
