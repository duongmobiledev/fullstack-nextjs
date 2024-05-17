import produce from 'immer';
import { AnyAction } from 'redux';

import * as types from '@redux/types/common';

import { IToast } from '@typings';

interface ICommonState {
  actionSuccess: boolean;
  isLoading: boolean;
  isOpenNavBar: boolean;
  notify: IToast | null;
}

const initialState: ICommonState = {
  actionSuccess: false,
  isLoading: false,
  isOpenNavBar: false,
  notify: null,
};

const commonReducer = (state = initialState, action: AnyAction) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.ACTION_SUCCESS:
        draft.actionSuccess = true;
        break;
      case types.RESET_ACTION:
        draft.actionSuccess = false;
        break;
      case types.SET_LOADING:
        draft.isLoading = action.payload;
        break;

      case types.SET_NOTIFICATION:
        draft.notify = action.payload;
        break;
    }
  });

export default commonReducer;
