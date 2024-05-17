import {
  IDataHistory,
  IHistoryAdminRequest,
  ISearchHistoryRequest,
} from 'src/typings/Admin/History';

import * as types from '@redux/types/admin/history';

export const loadSearchHistoryRequest = (payload: ISearchHistoryRequest) => ({
  type: types.LOAD_SEARCH_HISTORY_REQUEST,
  payload,
});
export const loadSearchHistorySuccess = (payload: string[]) => ({
  type: types.LOAD_SEARCH_HISTORY_SUCCESS,
  payload,
});
export const loadDataHistoryRequest = (payload: IHistoryAdminRequest) => ({
  type: types.LOAD_DATA_HISTORY_REQUEST,
  payload,
});
export const loadDataHistorySuccess = (payload: IDataHistory) => ({
  type: types.LOAD_DATA_HISTORY_SUCCESS,
  payload,
});
