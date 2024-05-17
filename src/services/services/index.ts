import _axios from 'axios';

import axiosUtils from '@common/utils/api';

import {
  IRequestApplyRenewalCoupon,
  IRequestHistory,
  IRequestLoadServices,
  IRequestLoadServicesDetail,
} from '@typings';

export const getDataProductServices = async (params: IRequestLoadServices) => {
  return await axiosUtils.get('/services', { params });
};
export const getDataDetailProductServices = async (
  params: IRequestLoadServicesDetail
) => {
  return await axiosUtils.get('/services/get_service_detail', {
    params,
  });
};

export const applyRenewalCouponApi = async (
  param: IRequestApplyRenewalCoupon
) => {
  return await axiosUtils.post('/coupons/apply_renewal_coupon', param);
};
// UI
export const getUIServices = async () => {
  return await axiosUtils.get('/ui');
};
