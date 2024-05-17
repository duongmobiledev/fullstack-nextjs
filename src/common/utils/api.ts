import _axios from 'axios';
import axiosRetry from 'axios-retry';

import {
  getAccessTokenLocalStorage,
  getTokenLocalStorage,
  removeKeyLocal,
  setAccessTokenLocalStorage,
  clearCookie,
} from '@common/utils/auth';

import { API_APP } from '@constants/app';

import { setNotify } from '@redux/actions/common';
import { makeStore } from '@redux/store';

import { refreshTokenService } from '@services/auth';

const axios = _axios.create({
  baseURL: API_APP,
});

// Request interceptor for API calls
axios.interceptors.request.use(
  async (config) => {
    const accessToken = getAccessTokenLocalStorage();
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${accessToken}`,
    };
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// Response interceptor for API calls
axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async function (error) {
    return Promise.reject(error);
  }
);
axiosRetry(axios, {
  retries: 1,
  retryCondition: async (error) => {
    if (error.response.status === 401) {
      try {
        const token = getTokenLocalStorage();
        const { data } = await refreshTokenService({
          refreshToken: token || '',
        });
        if (!data || data === null) {
          makeStore().dispatch(
            setNotify({
              type: 'error',
              title: 'Lỗi',
              message: 'Hết hạn phiên đăng nhập, vui lòng đăng nhập lại !',
            })
          );
          clearCookie();
          removeKeyLocal();
          setTimeout(() => {
            location.replace('/login');
          }, 3000);
        } else {
          setAccessTokenLocalStorage(data.accessToken);
          axios.defaults.headers.common['Authorization'] =
            'Bearer ' + data?.accessToken;
          return true;
        }
      } catch (error) {
        makeStore().dispatch(
          setNotify({
            type: 'error',
            title: 'Lỗi',
            message: 'Hết hạn phiên đăng nhập, vui lòng đăng nhập lại !',
          })
        );
        clearCookie();
        removeKeyLocal();
        setTimeout(() => {
          location.replace('/login');
        }, 3000);
        return false;
      }
    }
  },
});
export default axios;
