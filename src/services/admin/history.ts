import _axios from 'axios';
import {
  ISearchHistoryRequest,
  IHistoryAdminRequest,
} from 'src/typings/Admin/History';

import axiosUtils from '@common/utils/api';

export const getHistoryAdmin = async (params: IHistoryAdminRequest) => {
  return await axiosUtils.get('/admin/history', { params });
};
export const getSearchHistoryAdmin = async (params: ISearchHistoryRequest) => {
  return await axiosUtils.get('/admin/history/search', { params });
};
