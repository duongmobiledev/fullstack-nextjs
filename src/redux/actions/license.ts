import * as types from '@redux/types/license';

import {
  IPackage,
  IGetPackagePage,
  ICheckCoupon,
  ICheckCouponRespon,
  IPayment,
  IPaymentRespon,
  IPackageAll,
  IPaymentAgain,
  IGetMyInvoiceByService,
  ICancelPaymentRequest,
  IInvoice,
  IInvoiceResponse,
} from '@typings';

export const getPackagePage = (payload: IGetPackagePage) => ({
  type: types.GET_PACKAGE_PAGE,
  payload,
});
export const getPackagePageSuccess = <T>(payload: T) => ({
  type: types.GET_PACKAGE_PAGE_SUCCESS,
  payload,
});

export const payment = (payload: IPayment) => ({
  type: types.PAYMENT,
  payload,
});

export const paymentAgain = (payload: IPaymentAgain) => ({
  type: types.PAYMENT_AGAIN,
  payload,
});
export const paymentRespon = (payload: IPaymentRespon) => ({
  type: types.PAYMENT_RESPON,
  payload,
});

export const loadingPayment = (payload: boolean) => ({
  type: types.LOADING_PAYMENT,
  payload,
});
export const getPackageAllRequest = () => ({
  type: types.GET_PACKAGE_ALL_REQUEST,
});
export const getPackageAllSuccess = (payload: IPackageAll) => ({
  type: types.GET_PACKAGE_ALL_SUCCESS,
  payload,
});

export const getMyInvoiceByService = (payload: IGetMyInvoiceByService) => ({
  type: types.GET_MY_INVOICE_BY_SERVICE,
  payload,
});
export const getMyInvoiceByServiceSuccess = (payload: IInvoiceResponse) => ({
  type: types.GET_MY_INVOICE_BY_SERVICE_SUCCESS,
  payload,
});
export const cancelPaymentRequest = (payload: ICancelPaymentRequest) => ({
  type: types.CANCEL_PAYMENT_REQUEST,
  payload,
});
