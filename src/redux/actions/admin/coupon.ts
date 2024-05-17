import {
  ICouponListResponse,
  ICouponListRequest,
  ICouponRenewalRequest,
  ICouponSearchRequest,
} from 'src/typings/Admin/Coupon';

import * as types from '@redux/types/admin/coupon';

export const createCouponAdminRequest = (payload: ICouponRenewalRequest) => ({
  type: types.CREATE_COUPON_ADMIN_REQUEST,
  payload,
});
export const createCouponAdminSuccess = () => ({
  type: types.CREATE_COUPON_ADMIN_SUCCESS,
});
export const createCouponAdminError = () => ({
  type: types.CREATE_COUPON_ADMIN_ERROR,
});
///Get coupon list
export const loadCouponAdminListRequest = (payload: ICouponListRequest) => ({
  type: types.LOAD_DATA_COUPON_LIST_REQUEST,
  payload,
});
export const loadCouponAdminListSuccess = (payload: ICouponListResponse) => ({
  type: types.LOAD_DATA_COUPON_LIST_SUCCESS,
  payload,
});
export const loadCouponAdminListError = () => ({
  type: types.LOAD_DATA_COUPON_LIST_ERROR,
});
///Get coupon search
export const loadCouponAdminSearchRequest = (
  payload: ICouponSearchRequest
) => ({
  type: types.LOAD_DATA_COUPON_SEARCH_REQUEST,
  payload,
});
export const loadCouponAdminSearchSuccess = (payload: string[]) => ({
  type: types.LOAD_DATA_COUPON_SEARCH_SUCCESS,
  payload,
});
