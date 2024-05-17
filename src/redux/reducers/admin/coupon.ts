import produce from 'immer';
import { AnyAction } from 'redux';
import { ICouponListResponse } from 'src/typings/Admin/Coupon';

import * as types from '@redux/types/admin/coupon';

interface ICouponState {
  loadingCoupon: boolean;
  dataCouponList: ICouponListResponse;
  dataCouponSearch: string[];
  actionSuccess: boolean;
}
const initialState: ICouponState = {
  loadingCoupon: false,
  dataCouponList: null,
  dataCouponSearch: [],
  actionSuccess: false,
};
const couponReducer = (state = initialState, action: AnyAction) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.CREATE_COUPON_ADMIN_REQUEST:
        draft.loadingCoupon = true;
        draft.actionSuccess = false;
        break;
      case types.CREATE_COUPON_ADMIN_ERROR:
        draft.loadingCoupon = false;
        draft.actionSuccess = false;
        break;
      case types.CREATE_COUPON_ADMIN_SUCCESS:
        draft.loadingCoupon = false;
        draft.actionSuccess = true;
        break;
      case types.LOAD_DATA_COUPON_LIST_REQUEST:
        draft.dataCouponList = null;
        draft.actionSuccess = false;
        break;
      case types.LOAD_DATA_COUPON_LIST_SUCCESS:
        draft.dataCouponList = action.payload;
        break;
      case types.LOAD_DATA_COUPON_SEARCH_SUCCESS:
        draft.dataCouponSearch = action.payload;
        break;
    }
  });

export default couponReducer;
