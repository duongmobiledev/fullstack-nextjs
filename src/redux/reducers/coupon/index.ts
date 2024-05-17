import produce from 'immer';
import { AnyAction } from 'redux';

import * as types from '@redux/types/coupon';

import { ICheckCouponRespon } from '@typings';

interface ICouponState {
  couponResult: ICheckCouponRespon | null;
  loadingCheck: boolean;
}

const initialState: ICouponState = {
  couponResult: null,
  loadingCheck: false,
};

const couponReducer = (state = initialState, action: AnyAction) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.CHECK_COUPON_PROMOTION_RESULT:
        draft.couponResult = action.payload;
        break;
      case types.RESET_COUPON:
        draft.couponResult = null;
        break;
      case types.SET_LOADING_CHECK:
        draft.loadingCheck = action.payload;
        break;
    }
  });

export default couponReducer;
