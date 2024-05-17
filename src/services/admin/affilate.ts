import {
  IAffilateRequest,
  IChangeStatusAffilateRequest,
} from 'src/typings/Admin/Affilate';

import axiosUtils from '@common/utils/api';

export const getListSearchAffiances = async (params: IAffilateRequest) => {
  return await axiosUtils.get('/admin/affiliate/search', { params });
};
export const getListDataAffiances = async (params: IAffilateRequest) => {
  return await axiosUtils.get('/admin/affiliate/withdrawal-request', {
    params,
  });
};
export const changeStatusAffiliates = async (
  params: IChangeStatusAffilateRequest
) => {
  return await axiosUtils.post('/admin/affiliate/payment-confirmation', params);
};
