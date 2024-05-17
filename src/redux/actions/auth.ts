import * as types from '@redux/types/auth';

import {
  ILoginEmail,
  IUser,
  IUserProfile,
  ILoginAuthorize,
  IRefreshToken,
} from '@typings';

export const loginEmail = (payload: ILoginEmail) => ({
  type: types.LOGIN_EMAIL,
  payload,
});

export const loginWithAuthorize = (payload: ILoginAuthorize) => ({
  type: types.LOGIN_AUTHORIZE,
  payload,
});

export const loginWithAuthorizeSuccess = (payload: string) => ({
  type: types.LOGIN_AUTHORIZE_SUCCESS,
  payload,
});

export const reLogin = () => ({
  type: types.EXPIRED_AUTH,
});
export const resetExpired = () => ({
  type: types.RESET_EXPIRED_AUTH,
});

export const updateProfile = (payload: IUserProfile) => ({
  type: types.UPDATE_PROFILE,
  payload,
});
export const updateProfileSuccess = () => ({
  type: types.UPDATE_PROFILE_SUCCESS,
});

export const resetUpdateProfileSuccess = () => ({
  type: types.RESET_UPDATE_PROFILE_SUCCESS,
});

export const getProfileUser = () => ({ type: types.GET_PROFILE_USER });

export const getProfileUserSuccess = (payload: IUser) => ({
  type: types.GET_PROFILE_USER_SUCCESS,
  payload,
});

export const refreshToken = (payload: IRefreshToken) => ({
  type: types.REFRESH_TOKEN,
  payload,
});

export const refreshTokenSuccess = (payload: string) => ({
  type: types.REFRESH_TOKEN_SUCCESS,
  payload,
});
export const refreshTokenFailure = (payload: boolean) => ({
  type: types.REFRESH_TOKEN_FAILED,
  payload,
});
export const resetRefresh = () => ({
  type: types.RESET_REFRESH,
});
