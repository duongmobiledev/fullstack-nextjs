import { IRequestInvoiceDetail, IRequestLicense } from 'src/typings/OnePay';

import axiosUtils from '@common/utils/api';

export const getLicenseDetailAPI = async (params: IRequestLicense) => {
  return await axiosUtils.get('/licenses/get_license_detail', { params });
};
export const getInvoiceDetailAPI = async (params: IRequestInvoiceDetail) => {
  return await axiosUtils.get('/invoices/get_invoice_detail_by_order_id', {
    params,
  });
};
