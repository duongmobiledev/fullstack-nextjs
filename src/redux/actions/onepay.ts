import {
  IOnePayResult,
  IRequestInvoiceDetail,
  IRequestLicense,
} from 'src/typings/OnePay';

import * as types from '@redux/types/onepay';

export const getLicenseDetailResult = (payload: IRequestLicense) => ({
  type: types.GET_LICENSE_DETAIL_RESULT,
  payload,
});
export const getInvoiceDetail = (payload: IRequestInvoiceDetail) => ({
  type: types.GET_INVOICE_DETAIL_RESULT,
  payload,
});

export const getLicenseDetailResultSuccess = (payload: IOnePayResult) => ({
  type: types.GET_LICENSES_DETAIL_RESULT_SUCCESS,
  payload,
});
export const getLicenseDetailResultError = () => ({
  type: types.GET_LICENSE_DETAIL_RESULT_ERROR,
});
export const getInvoiceDetailSuccess = (payload: IOnePayResult) => ({
  type: types.GET_INVOICE_DETAIL_RESULT_SUCCESS,
  payload,
});
export const getInvoiceDetailError = () => ({
  type: types.GET_INVOICE_DETAIL_ERROR,
});
