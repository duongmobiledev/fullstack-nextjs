import { call, put } from 'redux-saga/effects';

import {
  getAffiliateProgramSuccess,
  getInvoicesRecieveCommissionSuccess,
  getPresenteesSuccess,
} from '@redux/actions/affiliate';
import { actionSuccess, setLoading, setNotify } from '@redux/actions/common';

import {
  getAffiliateProgram,
  getInvoicesReceiveCommissionByUser,
  getPresentees,
  requestWithdraw,
} from '@services/affiliate';

import { IResponse } from '@typings';

export function* getAffiliateProgramSaga() {
  yield put(setLoading(true));
  try {
    const response: IResponse = yield call(getAffiliateProgram);
    yield put(setLoading(false));
    const { data, status, success } = response || {};
    if (success) {
      yield put(getAffiliateProgramSuccess(data));
    }
  } catch (e) {
    yield put(setLoading(false));
    yield put(
      setNotify({
        type: 'error',
        title: 'Lỗi',
        message: 'Đã có lỗi xảy ra với hệ thống, vui lòng thử lại sau !',
      })
    );
  }
}
export function* getInvoicesReceiveCommissionByUserSaga(payload: any) {
  try {
    const variables = payload.payload;
    yield put(setLoading(true));
    const response: IResponse = yield call(
      getInvoicesReceiveCommissionByUser,
      variables
    );
    yield put(setLoading(false));
    const { data, status, success } = response || {};
    if (success) {
      yield put(getInvoicesRecieveCommissionSuccess(data));
    }
  } catch (e) {
    yield put(setLoading(false));
    yield put(
      setNotify({
        type: 'error',
        title: 'Lỗi',
        message: 'Đã có lỗi xảy ra với hệ thống, vui lòng thử lại sau !',
      })
    );
  }
}
export function* getPresenteesSaga(payload: any) {
  try {
    const variables = payload.payload;
    yield put(setLoading(true));
    const response: IResponse = yield call(getPresentees, variables);
    yield put(setLoading(false));
    const { data, status, success } = response || {};
    if (success) {
      yield put(getPresenteesSuccess(data));
    }
  } catch (e) {
    yield put(setLoading(false));
    yield put(
      setNotify({
        type: 'error',
        title: 'Lỗi',
        message: 'Đã có lỗi xảy ra với hệ thống, vui lòng thử lại sau !',
      })
    );
  }
}

export function* requestWithdrawSaga(payload: any) {
  try {
    const variables = payload.payload;
    yield put(setLoading(true));
    const response: IResponse = yield call(requestWithdraw, variables);
    yield put(setLoading(false));
    const { data, status, message, success } = response || {};
    if (success) {
      yield put(actionSuccess());
      yield put(
        setNotify({
          type: 'success',
          title: 'Thành công',
          message: 'Gửi yêu cầu rút tiền thành công !',
        })
      );
    } else {
      yield put(
        setNotify({
          type: 'error',
          title: 'Thất bại',
          message: 'Gửi yêu cầu thất bại, vui lòng thử lại !',
        })
      );
    }
  } catch (e) {
    yield put(setLoading(false));
    yield put(
      setNotify({
        type: 'error',
        title: 'Lỗi',
        message: 'Đã có lỗi xảy ra với hệ thống, vui lòng thử lại sau !',
      })
    );
  }
}
