import produce from 'immer';
import { AnyAction } from 'redux';

import * as types from '@redux/types/admin';

import { ICustomerRespon, ILicenseRespon } from '@typings';

interface ICustomerState {
  customer: ICustomerRespon | null;
  license: ILicenseRespon | null;
}

const initialState: ICustomerState = {
  customer: null,
  license: null,
};

const customerReducer = (state = initialState, action: AnyAction) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.GET_LIST_CUSTOMER_SUCCESS:
        draft.customer = action.payload;
        break;
      case types.GET_LICENSE_LIST_BY_USER_SUCCESS:
        draft.license = action.payload;
        break;
    }
  });

export default customerReducer;
