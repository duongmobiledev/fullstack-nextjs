import { all, takeLatest } from 'redux-saga/effects';

import * as types from '@redux/types/auth';

import {
  login,
  loginWithAuthorizeSaga,
  updateProfile,
  getProfile,
} from './login';
import { refreshToken } from './refreshToken';

export default function* authSaga() {
  yield all([
    takeLatest(types.LOGIN_EMAIL, login),
    takeLatest(types.LOGIN_AUTHORIZE, loginWithAuthorizeSaga),
    takeLatest(types.UPDATE_PROFILE, updateProfile),
    takeLatest(types.GET_PROFILE_USER, getProfile),
    takeLatest(types.REFRESH_TOKEN, refreshToken),
  ]);
}
