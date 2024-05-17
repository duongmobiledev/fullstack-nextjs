import { IBanner } from 'src/typings/Admin/Banner';

import * as types from '@redux/types/services';

import {
  IDataServicesResponse,
  IRequestApplyRenewalCoupon,
  IRequestLoadServices,
  IRequestLoadServicesDetail,
  IService,
} from '@typings';

export const loadDataServices = (payload: IRequestLoadServices) => ({
  type: types.LOAD_DATA,
  payload,
});

export const applyIsRenewalCouponAction = (
  payload: IRequestApplyRenewalCoupon
) => ({
  type: types.APPLY_COUPON,
  payload,
});
export const loadDataDetailServices = (
  payload: IRequestLoadServicesDetail
) => ({
  type: types.LOAD_DATA_DETAIL,
  payload,
});
export const loadDataServicesSuccess = (payload: IDataServicesResponse) => ({
  type: types.LOAD_DATA_SUCCESS,
  payload,
});
export const loadDataServicesUISuccess = (payload: IBanner) => ({
  type: types.LOAD_DATA_UI_SUCCESS,
  payload,
});

export const loadDataDetailServicesSuccess = (payload: IService) => ({
  type: types.LOAD_DATA_DETAIL_SUCCESS,
  payload,
});
export const loadDataDetailServicesError = () => ({
  type: types.LOAD_DATA_DETAIL_ERROR,
});
export const loadDataServicesError = () => ({
  type: types.LOAD_DATA_ERROR,
});

export const checkCouponRenewalSuccessAction = () => ({
  type: types.CHECK_COUPON_SUCCESS,
});

export const checkCouponRenewalErrorAction = () => ({
  type: types.CHECK_COUPON_ERROR,
});
