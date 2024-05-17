import { call, put } from 'redux-saga/effects';

import {
  getCustomerListSuccess,
  getLicenseListByUserSuccess,
} from '@redux/actions/admin';
import { setLoading, setNotify, actionSuccess } from '@redux/actions/common';

import {
  getListCustomerService,
  getLicenseListByUserService,
  updateCustomerService,
} from '@services/admin/customer';

import { IResponse } from '@typings';

export function* getCustomerList(payload: any) {
  yield put(setLoading(true));
  try {
    const variables = payload.payload;
    const response: IResponse = yield call(getListCustomerService, variables);
    yield put(setLoading(false));
    const { data, status, success } = response || {};
    if (success) {
      yield put(getCustomerListSuccess(data));
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

export function* getLicenseListByUser(payload: any) {
  yield put(setLoading(true));
  try {
    const variables = payload.payload;
    const response: IResponse = yield call(
      getLicenseListByUserService,
      variables
    );
    yield put(setLoading(false));
    const { data, status, success } = response || {};
    if (success) {
      yield put(getLicenseListByUserSuccess(data));
    }
  } catch (e) {
    yield put(setLoading(false));
    console.log(e);
    yield put(
      setNotify({
        type: 'error',
        title: 'Lỗi',
        message: 'Đã có lỗi xảy ra với hệ thống, vui lòng thử lại sau !',
      })
    );
  }
}

export function* updateCustomer(payload: any) {
  yield put(setLoading(true));
  try {
    const variables = payload.payload;
    const response: IResponse = yield call(updateCustomerService, variables);
    yield put(setLoading(false));
    const { data, status, success } = response || {};
    if (success) {
      yield put(actionSuccess());
      yield put(
        setNotify({
          type: 'success',
          title: 'Thành công',
          message: 'Cập nhật thông tin khách hàng thành công !',
        })
      );
    } else {
      yield put(
        setNotify({
          type: 'error',
          title: 'Thất bại',
          message: 'Cập nhật thất bại, vui lòng thử lại !',
        })
      );
    }
  } catch (e) {
    yield put(setLoading(false));
    console.log(e);
    yield put(
      setNotify({
        type: 'error',
        title: 'Lỗi',
        message: 'Đã có lỗi xảy ra với hệ thống, vui lòng thử lại sau !',
      })
    );
  }
}
