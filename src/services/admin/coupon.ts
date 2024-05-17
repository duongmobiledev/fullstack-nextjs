import _axios from 'axios';

import axiosUtils from '@common/utils/api';

import {
  ICouponListRequest,
  ICouponRenewalRequest,
  ICouponSearchRequest,
} from '@typings';

export const createCouponAdminAPI = async (params: ICouponRenewalRequest) => {
  return await axiosUtils.post('/admin/coupon/create', params);
};
export const getCouponListAdminAPI = async (params: ICouponListRequest) => {
  return await axiosUtils.get('/admin/coupon/list', { params });
};
export const getCouponSearchAdminAPI = async (params: ICouponSearchRequest) => {
  return await axiosUtils.get('/admin/coupon/search', { params });
};
