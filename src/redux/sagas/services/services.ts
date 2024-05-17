import { call, put } from 'redux-saga/effects';

import { setLoading, setNotify } from '@redux/actions/common';
import {
  checkCouponRenewalErrorAction,
  checkCouponRenewalSuccessAction,
  loadDataDetailServicesError,
  loadDataDetailServicesSuccess,
  loadDataServicesError,
  loadDataServicesSuccess,
  loadDataServicesUISuccess,
} from '@redux/actions/services';

import {
  applyRenewalCouponApi,
  getDataDetailProductServices,
  getDataProductServices,
  getUIServices,
} from '@services/services';

import { IResponse } from '@typings';

export function* loadDataServices(payload: any) {
  try {
    const params = payload.payload;
    const response: IResponse = yield call(getDataProductServices, params);
    const responseUI: IResponse = yield call(getUIServices);

    const { data, status, success } = response || {};
    if (success) {
      yield put(loadDataServicesSuccess(data));
    } else {
      yield put(loadDataServicesError());
    }
    if (responseUI.success && responseUI.data != null) {
      yield put(loadDataServicesUISuccess(responseUI.data));
    }
  } catch (e) {
    yield put(loadDataServicesError());
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

export function* loadDataDetailServices(payload: any) {
  const params = payload.payload;
  try {
    yield put(setLoading(true));

    const response: IResponse = yield call(
      getDataDetailProductServices,
      params
    );

    yield put(setLoading(false));
    const { data, status, success } = response || {};
    if (success) {
      yield put(loadDataDetailServicesSuccess(data));
    } else {
      yield put(loadDataDetailServicesError());
    }
  } catch (e) {
    console.log(e);
    yield put(loadDataDetailServicesError());
    yield put(setLoading(false));

    setNotify({
      type: 'error',
      title: 'Failure',
      message: 'Đã có lỗi xảy ra với hệ thống, vui lòng thử lại sau ! !',
    });
  }
}
export function* applyRenewalCoupon(payload: any) {
  const params = payload.payload;

  try {
    const response: IResponse = yield call(applyRenewalCouponApi, params);
    const { data, status, success } = response || {};

    if (success) {
      yield put(checkCouponRenewalSuccessAction());
    } else {
      yield put(checkCouponRenewalErrorAction());
      setNotify({
        type: 'error',
        title: 'Failure',
        message: 'Your coupon code is incorrect!',
      });
    }
  } catch (e) {
    console.log('error', e);
    yield put(checkCouponRenewalErrorAction());
    setNotify({
      type: 'error',
      title: 'Failure',
      message: 'Đã có lỗi xảy ra với hệ thống, vui lòng thử lại sau ! !',
    });
  }
}
