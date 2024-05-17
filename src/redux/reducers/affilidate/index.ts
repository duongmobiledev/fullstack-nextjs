import produce from 'immer';
import { AnyAction } from 'redux';

import * as types from '@redux/types/affiliate';

import {
  IDataHistoryWithDraw,
  IHistoryWithDraw,
  IInvoicesReceiveCommissionResponse,
  IOverviewAffilidate,
  IPresenteeResponse,
} from '@typings';

interface IAffilidateState {
  overview: IOverviewAffilidate | null;
  users: IPresenteeResponse | null;
  invoiceReceiveCommission: IInvoicesReceiveCommissionResponse | null;
  dataHistory: IDataHistoryWithDraw | null;
  loadingHistory: boolean;
}

const initialState: IAffilidateState = {
  overview: null,
  dataHistory: null,
  loadingHistory: false,

  invoiceReceiveCommission: null,
  users: null,
};

const affilidateReducer = (state = initialState, action: AnyAction) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.LOAD_DATA_HISTORY:
        draft.loadingHistory = false;
      case types.LOAD_DATA_HISTORY_SUCCESS:
        draft.loadingHistory = true;
        draft.dataHistory = action?.payload;
      case types.LOAD_DATA_HISTORY_ERROR:
        draft.loadingHistory = false;
      case types.GET_AFFILIATE_PROGRAM_SUCCESS:
        draft.overview = action.payload;
        break;
      case types.GET_INVOICES_RECEIVE_COMMISSION_SUCCESS:
        draft.invoiceReceiveCommission = action.payload;
        break;
      case types.GET_PRESENTEE_SUCCESS:
        draft.users = action.payload;
        break;
    }
  });

export default affilidateReducer;
