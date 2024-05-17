import axios from '@common/utils/api';

import {
  ILoginEmail,
  ILoginAuthorize,
  IUserProfile,
  IRefreshToken,
} from '@typings';

export const loginEmailService = async (params: ILoginEmail) => {
  return await axios.post('/auth/request_login', params);
};

export const loginWithAuthorizeService = async (params: ILoginAuthorize) => {
  return await axios.post('/auth/login/authorize', {
    loginToken: params.loginToken,
  });
};
export const updateProfileService = async (params: IUserProfile) => {
  return await axios.patch('/profile/update', params);
};
export const getProfileUserService = async () => {
  return await axios.get('/profile');
};
export const refreshTokenService = async (variables: IRefreshToken) => {
  return await axios.post('/auth/refresh_token', variables);
};
