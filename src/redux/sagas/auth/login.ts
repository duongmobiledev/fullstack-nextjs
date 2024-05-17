import { call, put } from 'redux-saga/effects';

import {
  reLogin,
  loginWithAuthorizeSuccess,
  getProfileUserSuccess,
  updateProfileSuccess,
} from '@redux/actions/auth';
import { actionSuccess, setLoading, setNotify } from '@redux/actions/common';

import {
  loginEmailService,
  loginWithAuthorizeService,
  updateProfileService,
  getProfileUserService,
} from '@services/auth';

import { IResponse, IUser } from '@typings';

export function* login(payload: any) {
  const variables = payload.payload;
  yield put(setLoading(true));
  try {
    const response: IResponse = yield call(loginEmailService, variables);
    yield put(setLoading(false));
    const { data, status, success } = response || {};
    if (success) {
      yield put(actionSuccess());
      yield put(
        setNotify({
          type: 'success',
          title: 'Thành công',
          message: 'Đăng nhập thành công !',
        })
      );
    } else {
      yield put(
        setNotify({
          type: 'error',
          title: 'Thất bại',
          message: 'Đăng nhập thất bại, vui lòng thử lại !',
        })
      );
    }
  } catch (error) {
    yield put(setLoading(false));
    yield put(
      setNotify({
        type: 'error',
        title: 'Thất bại',
        message: 'Đã có lỗi xảy ra với hệ thống, vui lòng thử lại sau ! !',
      })
    );
    console.log(error);
  }
}

export function* loginWithAuthorizeSaga(payload: any) {
  const variables = payload.payload;
  try {
    const response: IResponse = yield call(
      loginWithAuthorizeService,
      variables
    );
    const { data, status, success } = response || {};
    if (success) {
      const { refreshToken } = data;
      yield put(loginWithAuthorizeSuccess(refreshToken));
      yield put(
        setNotify({
          type: 'success',
          title: 'Thành công',
          message: 'Xác thực thành công !',
        })
      );
      yield put(actionSuccess());
    } else {
      yield put(reLogin());
      yield put(
        setNotify({
          type: 'error',
          title: 'Thất bại',
          message: 'Thời gian xác nhận hết hạn, vui lòng thử lại !',
        })
      );
    }
  } catch (error) {
    console.log(error);
    yield put(reLogin());
    yield put(
      setNotify({
        type: 'error',
        title: 'Thất bại',
        message: 'Đã có lỗi xảy ra với hệ thống, vui lòng thử lại sau ! !',
      })
    );
  }
}

export function* getProfile() {
  yield put(setLoading(true));
  try {
    const response: IResponse = yield call(getProfileUserService);
    const { data, status, success } = response || {};
    if (success) {
      yield put(getProfileUserSuccess(data));
    }
    yield put(setLoading(false));
  } catch (error) {
    console.log(error);
    yield put(setLoading(false));
    yield put(
      setNotify({
        type: 'error',
        title: 'Thất bại',
        message: 'Đã có lỗi xảy ra với hệ thống, vui lòng thử lại sau ! !',
      })
    );
  }
}

export function* updateProfile(payload: any) {
  const variables = payload.payload;
  yield put(setLoading(true));
  try {
    const response: IResponse = yield call(updateProfileService, variables);
    yield put(setLoading(false));
    const { data, status, success } = response || {};
    if (success) {
      yield put(updateProfileSuccess());
      yield put(
        setNotify({
          type: 'success',
          title: 'Thành công',
          message: 'Cập nhật thông tin thành công !',
        })
      );
      // yield put(getProfileUserSuccess(data));
    } else {
      yield put(
        setNotify({
          type: 'error',
          title: 'Thất bại',
          message: 'Cập nhật thất bại, vui lòng thử lại !',
        })
      );
    }
  } catch (error) {
    console.log(error);
    yield put(setLoading(false));
    yield put(
      setNotify({
        type: 'error',
        title: 'Thất bại',
        message: 'Đã có lỗi xảy ra với hệ thống, vui lòng thử lại sau !',
      })
    );
  }
}
