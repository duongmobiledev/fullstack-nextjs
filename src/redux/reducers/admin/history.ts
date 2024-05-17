import produce from 'immer';
import { AnyAction } from 'redux';
import { IDataHistory } from 'src/typings/Admin/History';

import * as types from '@redux/types/admin/history';

interface ICouponState {
  dataHistory: IDataHistory;
  dataHistorySearch: string[];
}
const initialState: ICouponState = {
  dataHistory: null,
  dataHistorySearch: [],
};
const couponReducer = (state = initialState, action: AnyAction) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.LOAD_DATA_HISTORY_REQUEST:
        break;
      case types.LOAD_DATA_HISTORY_SUCCESS:
        draft.dataHistory = action.payload;
        break;
      case types.LOAD_SEARCH_HISTORY_REQUEST:
        break;
      case types.LOAD_SEARCH_HISTORY_SUCCESS:
        draft.dataHistorySearch = action.payload;
        break;
    }
  });

export default couponReducer;
