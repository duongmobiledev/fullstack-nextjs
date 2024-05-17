import produce from 'immer';
import { AnyAction } from 'redux';
import { IDataAffilateResponse } from 'src/typings/Admin/Affilate';

import * as types from '@redux/types/admin/affilate';

interface IAffilateState {
  dataListSearch: string[];
  data: IDataAffilateResponse;
  actionChange: boolean;
}
const initialState: IAffilateState = {
  data: null,
  dataListSearch: [],
  actionChange: false,
};
const affialteReducer = (state = initialState, action: AnyAction) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.GET_LIST_SEARCH_AFFILATE_REQUEST:
        draft.actionChange = false;
        break;
      case types.GET_LIST_SEARCH_AFFILATE_SUCCESS:
        draft.dataListSearch = action.payload;
        break;
      case types.LOAD_DATA_SEARCH_AFFILATE_REQUEST:
        draft.actionChange = false;
        break;
      case types.LOAD_DATA_SEARCH_AFFILATE_SUCCESS:
        draft.data = action.payload;
        break;
      case types.CHANGE_STATUS_AFFILATES_REQUEST:
        draft.actionChange = false;
        break;
      case types.CHANGE_STATUS_AFFILATES_SUCCESS:
        draft.actionChange = true;
        break;
    }
  });

export default affialteReducer;
