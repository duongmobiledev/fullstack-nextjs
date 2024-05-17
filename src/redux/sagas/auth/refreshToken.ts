import { call, put } from 'redux-saga/effects';

import {
  refreshTokenSuccess,
  reLogin,
  refreshTokenFailure,
} from '@redux/actions/auth';
import { actionSuccess, setLoading, setNotify } from '@redux/actions/common';

import { refreshTokenService } from '@services/auth';

import { IResponse } from '@typings';

export function* refreshToken(payload) {
  const variables = payload.payload;

  try {
    const response: IResponse = yield call(refreshTokenService, variables);
    const { data, status, success } = response || {};
    if (success) {
      yield put(actionSuccess());
      const { accessToken } = data;
      yield put(refreshTokenSuccess(accessToken));
    } else {
      yield put(refreshTokenFailure(true));
    }
  } catch (error) {
    yield put(
      setNotify({
        type: 'error',
        title: 'Thất bại',
        message: 'Bạn không có quyền truy cập, vui lòng thử lại sau !',
      })
    );
    console.log(error);
  }
}
