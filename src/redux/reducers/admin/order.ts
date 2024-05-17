import produce from 'immer';
import { AnyAction } from 'redux';

import * as types from '@redux/types/admin';

import { IOrderRespon } from '@typings';

interface IOrderState {
  order: IOrderRespon | null;
}

const initialState: IOrderState = {
  order: null,
};

const orderReducer = (state = initialState, action: AnyAction) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.GET_ORDER_LIST_SUCCESS:
        draft.order = action.payload;
        break;
    }
  });

export default orderReducer;
