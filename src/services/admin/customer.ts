import _axios from '@common/utils/api';

import {
  IGetListWithKeyValue,
  IGetLicenseListByUser,
  IUpdateCustomer,
} from '@typings';

export const getListCustomerService = async (params: IGetListWithKeyValue) => {
  return await _axios.get('/admin/customer/list', { params });
};
export const getCustomerSearchService = async (
  params: IGetListWithKeyValue
) => {
  return await _axios.get('/admin/customer/search', { params });
};
export const getLicenseListByUserService = async (
  params: IGetLicenseListByUser
) => {
  return await _axios.get('/admin/customer/licenses', { params });
};

export const updateCustomerService = async (params: IUpdateCustomer) => {
  return await _axios.post('/admin/customer/update', params);
};
