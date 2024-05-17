import * as types from '@redux/types/common';

import { IToast } from '@typings';

export const setNotify = (payload: IToast | null) => ({
  type: types.SET_NOTIFICATION,
  payload,
});
export const setLoading = (payload: boolean) => ({
  type: types.SET_LOADING,
  payload,
});
export const actionSuccess = () => ({
  type: types.ACTION_SUCCESS,
});
export const resetAction = () => ({
  type: types.RESET_ACTION,
});
