import produce from 'immer';
import { AnyAction } from 'redux';
import { IBanner } from 'src/typings/Admin/Banner';

import * as types from '@redux/types/services';

import { IService } from '@typings';

interface IServiceState {
  actionSuccess: boolean;
  loading: boolean;
  loadingCoupon: boolean;
  errorCoupon: boolean;
  error: boolean;
  dataService: IService[];
  dataServiceDetail: IService | null;
  total: number;
  checkCouponRenewalSuccess: boolean;
  errorDetail: boolean;
  dataUI: IBanner;
}
const initialState: IServiceState = {
  loadingCoupon: false,
  actionSuccess: false,
  dataService: [],
  loading: false,
  error: false,
  errorDetail: false,
  errorCoupon: false,
  dataServiceDetail: null,
  total: 1,
  checkCouponRenewalSuccess: false,
  dataUI: null,
};

const servicesReducer = (state = initialState, action: AnyAction) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.LOAD_DATA:
        draft.loading = true;
        draft.error = false;
        break;
      case types.LOAD_DATA_DETAIL:
        draft.loading = false;
        break;
      case types.LOAD_DATA_ERROR:
        draft.error = true;
        break;
      case types.LOAD_DATA_SUCCESS:
        draft.loading = false;
        draft.error = false;
        var _temp = action.payload?.items ?? [];
        draft.dataService = [...draft.dataService, ..._temp];
        draft.total = action.payload?.total;
        break;
      case types.LOAD_DATA_UI_SUCCESS:
        draft.dataUI = action.payload;
        break;
      case types.LOAD_DATA_DETAIL_ERROR:
        draft.loading = false;
        draft.errorDetail = true;
        break;
      case types.LOAD_DATA_DETAIL_SUCCESS:
        draft.loading = false;
        draft.dataServiceDetail = action.payload;
        break;
      case types.APPLY_COUPON:
        draft.loadingCoupon = true;
        break;
      case types.CHECK_COUPON_SUCCESS:
        draft.loadingCoupon = false;
        draft.checkCouponRenewalSuccess = true;
        draft.errorCoupon = false;
        break;
      case types.CHECK_COUPON_ERROR:
        draft.loadingCoupon = false;
        draft.errorCoupon = true;
        break;
    }
  });

export default servicesReducer;
