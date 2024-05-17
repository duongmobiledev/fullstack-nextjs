import axios from '@common/utils/api';

import {
  IGetPackagePage,
  IPayment,
  IPaymentAgain,
  IGetMyInvoiceByService,
  ICancelPaymentRequest,
} from '@typings';

export const getPackagesPageService = async (params: IGetPackagePage) => {
  return await axios.get('packages/get_package_page', { params });
};
export const paymentService = async (params: IPayment) => {
  return await axios.post('/payment-service/request', params);
};
export const getPackageAllAPI = async () => {
  return await axios.get('/packages');
};

export const getMyInvoiceByService = async (params: IGetMyInvoiceByService) => {
  return await axios.get('/invoices/my-invoices-by-service', { params });
};

export const cancelPaymentRequest = async (params: ICancelPaymentRequest) => {
  return await axios.post('/payment-service/cancel-payment-request', params);
};
export const paymentAgainService = async (params: IPaymentAgain) => {
  return await axios.post('/payment-service/pay-again', params);
};
