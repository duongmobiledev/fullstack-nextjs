import axios from '@common/utils/api';

import { IGetListAPIPagination, IWithdrawRequest } from '@typings';

export const getAffiliateProgram = async () =>
  await axios.get('/user/affiliate-program');

export const checkOnProcessingWithdrawRequest = async () => {
  return await axios.get('/user/check-on-processing-withdraw-request');
};

export const requestWithdraw = async (params: IWithdrawRequest) =>
  await axios.post('/user/withdraw', params);

export const getInvoicesReceiveCommissionByUser = async (
  params: IGetListAPIPagination
) => await axios.get('/invoices/my-invoices-receive-commission', { params });

export const getPresentees = async (params: IGetListAPIPagination) =>
  await axios.get('/user/my-users', { params });
