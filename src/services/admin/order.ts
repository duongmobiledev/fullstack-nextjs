import axios from '@common/utils/api';

import { IGetListWithKeyValue } from '@typings';

export const getOrderSearchService = async (params: IGetListWithKeyValue) =>
  await axios.get('/admin/order/search', { params });

export const getOrderListService = async (params: IGetListWithKeyValue) =>
  await axios.get('/admin/order/list', { params });
