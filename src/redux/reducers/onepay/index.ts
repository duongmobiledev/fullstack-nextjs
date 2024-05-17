import produce from 'immer';
import { AnyAction } from 'redux';
import { IOnePayResult } from 'src/typings/OnePay';

import * as types from '@redux/types/onepay';

interface IOnePayState {
  loading: boolean;
  error: boolean;
  actionSuccess: boolean;
  data: IOnePayResult;
}
const initialState: IOnePayState = {
  actionSuccess: false,
  loading: false,
  error: false,
  data: null,
};

const onePayReducer = (state = initialState, action: AnyAction) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.GET_LICENSE_DETAIL_RESULT:
        draft.loading = true;
      case types.GET_INVOICE_DETAIL_RESULT:
        draft.loading = true;
      case types.GET_LICENSES_DETAIL_RESULT_SUCCESS:
        draft.actionSuccess = true;
        draft.loading = false;
        draft.data = action.payload;
      case types.GET_LICENSE_DETAIL_RESULT_ERROR:
        draft.error = true;
        draft.loading = false;
      case types.GET_INVOICE_DETAIL_RESULT_SUCCESS:
        draft.actionSuccess = true;
        draft.loading = false;
        draft.data = action.payload;
      case types.GET_INVOICE_DETAIL_ERROR:
        draft.error = true;
        draft.loading = false;
    }
  });

export default onePayReducer;
