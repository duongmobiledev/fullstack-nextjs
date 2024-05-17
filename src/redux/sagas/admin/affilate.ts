import { call, put } from 'redux-saga/effects';

import {
  changeStatusSuccess,
  getListAffilateSuccess,
  loadDataAffilateSuccess,
} from '@redux/actions/admin/affilate';
import { setLoading, setNotify } from '@redux/actions/common';

import {
  changeStatusAffiliates,
  getListDataAffiances,
  getListSearchAffiances,
} from '@services/admin/affilate';

import { IResponse } from '@typings';

export function* getListSearchAffilatesApi(payload: any) {
  try {
    const variables = payload.payload;
    const response: IResponse = yield call(getListSearchAffiances, variables);
    const { data, status } = response || {};
    yield put(getListAffilateSuccess(data));
  } catch (e) {
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
export function* getListDataAffilatesApi(payload: any) {
  try {
    const variables = payload.payload;
    const response: IResponse = yield call(getListDataAffiances, variables);
    const { data, status, success } = response || {};
    if (success) {
      yield put(loadDataAffilateSuccess(data));
    }
  } catch (e) {
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
export function* changeStatusAffilateApi(payload: any) {
  try {
    const variables = payload.payload;
    const response: IResponse = yield call(changeStatusAffiliates, variables);
    const { data, status, success } = response || {};
    if (success) {
      yield put(changeStatusSuccess());
      yield put(
        setNotify({
          type: 'success',
          title: 'Thành Công',
          message: 'Thao tác thành công',
        })
      );
    } else {
      yield put(
        setNotify({
          type: 'error',
          title: 'Lỗi',
          message: 'Không thành công, Vui lòng thử lại',
        })
      );
    }
  } catch (e) {
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
