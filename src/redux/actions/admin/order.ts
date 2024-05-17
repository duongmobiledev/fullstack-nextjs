import * as types from '@redux/types/admin/order';

import { IGetListWithKeyValue, IOrderRespon } from '@typings';

export const getOrderList = (payload: IGetListWithKeyValue) => ({
  type: types.GET_ORDER_LIST,
  payload,
});

export const getOrderListSuccess = (payload: IOrderRespon) => ({
  type: types.GET_ORDER_LIST_SUCCESS,
  payload,
});
