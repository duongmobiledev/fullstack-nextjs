import { all, takeLatest } from 'redux-saga/effects';

import * as types from '@redux/types/admin';

import {
  getListSearchAffilatesApi,
  getListDataAffilatesApi,
  changeStatusAffilateApi,
} from './affilate';
import { uploadBannerApi } from './banner';
import {
  createCouponAdmin,
  loadCouponListAdmin,
  loadCouponSearchAdmin,
} from './coupon';
import {
  getCustomerList,
  getLicenseListByUser,
  updateCustomer,
} from './customer';
import { getSearchHistory, getDataHistoryAdmin } from './history';
import { getOrderList } from './order';

export default function* couponAdmin() {
  yield all([
    //COUPON
    takeLatest(types.CREATE_COUPON_ADMIN_REQUEST, createCouponAdmin),
    takeLatest(types.LOAD_DATA_COUPON_LIST_REQUEST, loadCouponListAdmin),
    takeLatest(types.LOAD_DATA_COUPON_SEARCH_REQUEST, loadCouponSearchAdmin),
    //Banner
    takeLatest(types.UPLOAD_BANNER_REQUEST, uploadBannerApi),
    //Affilates
    takeLatest(
      types.GET_LIST_SEARCH_AFFILATE_REQUEST,
      getListSearchAffilatesApi
    ),
    takeLatest(
      types.LOAD_DATA_SEARCH_AFFILATE_REQUEST,
      getListDataAffilatesApi
    ),
    takeLatest(types.CHANGE_STATUS_AFFILATES_REQUEST, changeStatusAffilateApi),
    //History
    takeLatest(types.LOAD_SEARCH_HISTORY_REQUEST, getSearchHistory),
    takeLatest(types.LOAD_DATA_HISTORY_REQUEST, getDataHistoryAdmin),
    //ORDER
    takeLatest(types.GET_ORDER_LIST, getOrderList),

    //CUSTOMER
    takeLatest(types.GET_LIST_CUSTOMER, getCustomerList),
    takeLatest(types.GET_LICENSE_LIST_BY_USER, getLicenseListByUser),
    takeLatest(types.UPDATE_CUSTOMER, updateCustomer),
  ]);
}
