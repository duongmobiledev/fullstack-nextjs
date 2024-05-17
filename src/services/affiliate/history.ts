import _axios from 'axios';

import axiosUtils from '@common/utils/api';

import { IRequestHistory } from '@typings';

export const getHistoryWithDrawApi = async (params: IRequestHistory) => {
  return await axiosUtils.get('/user/withdrawal-request', { params });
};
