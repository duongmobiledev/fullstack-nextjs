import {
  IAffilateRequest,
  IDataAffilateResponse,
  IChangeStatusAffilateRequest,
} from 'src/typings/Admin/Affilate';

import * as types from '@redux/types/admin/affilate';

export const getListAffilateRequest = (payload: IAffilateRequest) => ({
  type: types.GET_LIST_SEARCH_AFFILATE_REQUEST,
  payload,
});
export const getListAffilateSuccess = (payload: string[]) => ({
  type: types.GET_LIST_SEARCH_AFFILATE_SUCCESS,
  payload,
});
export const loadDataAffilateRequest = (payload: IAffilateRequest) => ({
  type: types.LOAD_DATA_SEARCH_AFFILATE_REQUEST,
  payload,
});
export const loadDataAffilateSuccess = (payload: IDataAffilateResponse) => ({
  type: types.LOAD_DATA_SEARCH_AFFILATE_SUCCESS,
  payload,
});
export const changeStatusRequest = (payload: IChangeStatusAffilateRequest) => ({
  type: types.CHANGE_STATUS_AFFILATES_REQUEST,
  payload,
});
export const changeStatusSuccess = () => ({
  type: types.CHANGE_STATUS_AFFILATES_SUCCESS,
});
