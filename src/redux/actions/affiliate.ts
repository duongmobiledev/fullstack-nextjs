import * as types from '@redux/types/affiliate';

import {
  IGetListAPIPagination,
  IHistoryWithDraw,
  IInvoice,
  IOverviewAffilidate,
  IPresentee,
  IRequestHistory,
  IWithdrawRequest,
} from '@typings';

export const getAffiliateProgram = () => ({
  type: types.GET_AFFILIATE_PROGRAM,
});
export const getAffiliateProgramSuccess = (payload: IOverviewAffilidate) => ({
  type: types.GET_AFFILIATE_PROGRAM_SUCCESS,
  payload,
});

export const getInvoicesRecieveCommission = (
  payload: IGetListAPIPagination
) => ({ type: types.GET_INVOICES_RECEIVE_COMMISSION, payload });

export const getInvoicesRecieveCommissionSuccess = (payload: IInvoice[]) => ({
  type: types.GET_INVOICES_RECEIVE_COMMISSION_SUCCESS,
  payload,
});

export const getPresentees = (payload: IGetListAPIPagination) => ({
  type: types.GET_PRESENTEE,
  payload,
});
export const getPresenteesSuccess = (payload: IPresentee[]) => ({
  type: types.GET_PRESENTEE_SUCCESS,
  payload,
});

export const requestWithdraw = (payload: IWithdrawRequest) => ({
  type: types.REQUEST_WITHDRAW,
  payload,
});

export const getHistoryWithDraw = (payload: IRequestHistory) => ({
  type: types.LOAD_DATA_HISTORY,
  payload,
});
export const getHistorySuccess = (payload: IHistoryWithDraw) => ({
  type: types.LOAD_DATA_HISTORY_SUCCESS,
  payload,
});
export const getHistoryError = () => ({
  type: types.LOAD_DATA_HISTORY_ERROR,
});
