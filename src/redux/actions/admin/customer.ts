import * as types from '@redux/types/admin';

import {
  IGetListWithKeyValue,
  ICustomerRespon,
  ILicense,
  ILicenseRespon,
  IUpdateCustomer,
} from '@typings';

export const getCustomerList = (payload: IGetListWithKeyValue) => ({
  type: types.GET_LIST_CUSTOMER,
  payload,
});

export const getCustomerListSuccess = (payload: ICustomerRespon) => ({
  type: types.GET_LIST_CUSTOMER_SUCCESS,
  payload,
});

export const getLicenseListByUser = (payload: IGetListWithKeyValue) => ({
  type: types.GET_LICENSE_LIST_BY_USER,
  payload,
});

export const getLicenseListByUserSuccess = (payload: ILicenseRespon) => ({
  type: types.GET_LICENSE_LIST_BY_USER_SUCCESS,
  payload,
});

export const updateCustomer = (payload: IUpdateCustomer) => ({
  type: types.UPDATE_CUSTOMER,
  payload,
});
