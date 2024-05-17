import { call, put } from 'redux-saga/effects';

import { setLoading, setNotify, actionSuccess } from '@redux/actions/common';
import {
  getPackagePageSuccess,
  paymentRespon,
  loadingPayment,
  getPackageAllSuccess,
  getMyInvoiceByServiceSuccess,
} from '@redux/actions/license';

import {
  getPackageAllAPI,
  getPackagesPageService,
  paymentService,
  paymentAgainService,
  getMyInvoiceByService,
  cancelPaymentRequest,
} from '@services/license';

import { IResponse } from '@typings';

export function* getPackagePage(payload: any) {
  try {
    const variables = payload.payload;
    yield put(setLoading(true));
    const response: IResponse = yield call(getPackagesPageService, variables);
    yield put(setLoading(false));
    const { data, status, success } = response || {};
    if (success) {
      yield put(getPackagePageSuccess(data));
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
export function* getPackageAll() {
  try {
    yield put(setLoading(true));
    const response: IResponse = yield call(getPackageAllAPI);
    yield put(setLoading(false));
    const { data, status, success } = response || {};
    if (success) {
      yield put(getPackageAllSuccess(data));
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

export function* payment(payload: any) {
  yield put(setLoading(true));
  try {
    const variables = payload.payload;
    const response: IResponse = yield call(paymentService, variables);
    const { data, status, success } = response || {};
    yield put(loadingPayment(false));
    if (success) {
      yield put(paymentRespon(data));
    } else {
      yield put(setLoading(false));
      yield put(
        setNotify({
          type: 'error',
          title: 'Lỗi',
          message: 'Dã xảy ra lỗi, vui lòng thử lại sau !',
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

export function* getMyInvoiceByServiceSaga(payload: any) {
  try {
    const variables = payload.payload;
    yield put(setLoading(true));
    const response: IResponse = yield call(getMyInvoiceByService, variables);
    yield put(setLoading(false));
    const { data, status, success } = response || {};

    if (success) {
      yield put(getMyInvoiceByServiceSuccess(data));
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

export function* cancelPaymentRequestSaga(payload: any) {
  try {
    const variables = payload.payload;
    yield put(setLoading(true));
    const response: IResponse = yield call(cancelPaymentRequest, variables);
    yield put(setLoading(false));
    const { data, status, success } = response || {};
    if (success) {
      yield put(actionSuccess());
      yield put(
        setNotify({
          type: 'success',
          title: 'Thành công',
          message: 'Cập nhật đơn hàng thành công !',
        })
      );
    } else {
      yield put(
        setNotify({
          type: 'error',
          title: 'Thất bại',
          message: 'Cập nhật đơn hàng thất bại, vui lòng thử lại sau !',
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
        message: 'Đã có lỗi xảy ra với hệ thống, vui lòng thử lại sau ! !',
      })
    );
  }
}

export function* paymentAgain(payload: any) {
  yield put(setLoading(true));
  try {
    const variables = payload.payload;
    const response: IResponse = yield call(paymentAgainService, variables);
    const { data, status, success } = response || {};
    if (success) {
      yield put(paymentRespon(data));
    } else {
      yield put(setLoading(false));
      yield put(
        setNotify({
          type: 'error',
          title: 'Lỗi',
          message: 'Dã xảy ra lỗi, vui lòng thử lại sau !',
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
