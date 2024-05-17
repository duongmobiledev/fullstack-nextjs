import produce from 'immer';
import { AnyAction } from 'redux';
import { IBanner } from 'src/typings/Admin/Banner';
import { ICouponListResponse } from 'src/typings/Admin/Coupon';

import * as types from '@redux/types/admin/banner';

interface IBannerState {
  loading: boolean;
  data: IBanner;
}
const initialState: IBannerState = {
  loading: false,
  data: null,
};
const bannerReducer = (state = initialState, action: AnyAction) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.UPLOAD_BANNER_REQUEST:
        draft.loading = true;
        break;
      case types.UPLOAD_BANNER_SUCCESS:
        draft.data = action.payload;
        draft.loading = false;
        break;
    }
  });

export default bannerReducer;
